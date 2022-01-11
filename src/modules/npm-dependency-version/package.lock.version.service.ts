import { Injectable } from '@nestjs/common';
import { get } from 'lodash';
import { CodeRepositoryService } from '../code-repository/code-repository.service';

@Injectable()
export class PackageLockVersionService {

  constructor(
    private codeRepositoryService: CodeRepositoryService,
  ) {
  }

  public async getVersion(repo, packageName, options): Promise<string[]> {
    const packageLock = await this.getPackageLock(repo, options);
    const rootVersion = get(packageLock, `dependencies.${packageName}.version`, null);

    if (!rootVersion) {
      return rootVersion;
    }

    let isRootVersionUsed = false;

    const versions = Object.keys(packageLock.dependencies)
      .map((dep) => {
        const isRequired = get(packageLock, `dependencies.${dep}.requires.${packageName}`, null);

        if (!isRequired) {
          return null;
        }

        const innerVersion = get(packageLock, `dependencies.${dep}.dependencies.${packageName}.version`, null);

        if (!innerVersion) {
          isRootVersionUsed = true;
        }

        return {
          host: dep,
          version: innerVersion || rootVersion,
        };
      })
      .filter((item) => item);

    if (!isRootVersionUsed) {
      versions.push({
        host: '<root>',
        version: rootVersion,
      });
    }

    return versions.map(({ host, version }) => `${version} for ${host}`);
  }

  private async getPackageLock(repo, options) {
    try {
      return JSON.parse(await this.codeRepositoryService.getFileContent(repo, 'package-lock.json', options));
    } catch (e) {
      return null;
    }
  }

}
