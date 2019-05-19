import { Injectable } from "@nestjs/common";
import { get } from 'lodash';
import { OctokitService } from "../octokit/octokit.service";

@Injectable()
export class PackageLockVersionService {

  constructor(
    private octokitService: OctokitService,
  ) {
  }

  public async getVersion(owner, repo, packageName): Promise<string> {
    const packageLock = await this.getPackageLock(owner, repo);
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
      })
    }

    return versions.map(({ host, version }) => `${version} for ${host}`).join('\n');
  }

  private async getPackageLock(owner, repo) {
    try {
      return JSON.parse(await this.octokitService.getFileContent(owner, repo, 'package-lock.json'));
    } catch (e) {
      return null;
    }
  }

}
