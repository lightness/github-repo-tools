import { Injectable } from '@nestjs/common';
import * as lockfile from '@yarnpkg/lockfile';
import { CodeRepositoryService } from '../code-repository/code-repository.service';

@Injectable()
export class YarnLockVersionService {

  private REGEXP = /^(.+)\@(.+)$/;

  constructor(
    private codeRepositoryService: CodeRepositoryService,
  ) {
  }

  public async getVersion(repo, packageName, options): Promise<string[]> {
    const doc = await this.getYarnLock(repo, options);

    if (doc.type !== 'success') {
      return null;
    }

    const dependencies = Object.keys(doc.object);

    const versionHash = dependencies
      .reduce(
        (acc, dep) => {
          const [full, depName, depVersion] = dep.match(this.REGEXP);

          if (depName === packageName) {
            acc[depVersion] = doc.object[dep].version;
          }

          return acc;
        },
        {},
      );

    const versionUsed = [];

    const versions = dependencies
      .map(dep => {
        const requiredVersion = doc.object[dep].dependencies && doc.object[dep].dependencies[packageName];

        if (!requiredVersion) {
          return null;
        }

        const version = versionHash[requiredVersion];

        versionUsed.push(version);

        return {
          host: dep,
          version,
        };
      })
      .filter(x => x);

    const versionsUnusedInDeps = Object.values(versionHash).filter(v => !versionUsed.includes(v));
    const allVersions = [
      ...versions,
      ...versionsUnusedInDeps.map(version => ({
        host: '<root>',
        version,
      }))
    ];

    return allVersions.map(({ host, version }) => `${version} for ${host}`);
  }

  private async getYarnLock(repo, options) {
    try {
      const content = await this.codeRepositoryService.getFileContent(repo, 'yarn.lock', options);

      return lockfile.parse(content);
    } catch (e) {
      return null;
    }
  }

}
