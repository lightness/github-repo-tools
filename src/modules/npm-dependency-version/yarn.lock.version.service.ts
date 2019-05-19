import { Injectable } from "@nestjs/common";
import * as lockfile from '@yarnpkg/lockfile';
import { OctokitService } from "../octokit/octokit.service";

@Injectable()
export class YarnLockVersionService {

  private REGEXP = /^(.+)\@(.+)$/;

  constructor(
    private octokitService: OctokitService,
  ) {
  }

  public async getVersion(owner, repo, packageName): Promise<string> {
    const doc = await this.getYarnLock(owner, repo);

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

    return allVersions.map(({ host, version }) => `${version} for ${host}`).join('\n');
  }

  private async getYarnLock(owner, repo) {
    try {
      const content = await this.octokitService.getFileContent(owner, repo, 'yarn.lock');

      return lockfile.parse(content);
    } catch (e) {
      return null;
    }
  }

}