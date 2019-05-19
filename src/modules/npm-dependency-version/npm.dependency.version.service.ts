import { Injectable } from "@nestjs/common";
import * as ora from 'ora';
import chalk from 'chalk';
import { IProgramOptions, IPackageOptions } from "../../interfaces";
import { OctokitService } from "../octokit/octokit.service";
import { PackageLockVersionService } from "./package.lock.version.service";
import { YarnLockVersionService } from "./yarn.lock.version.service";

@Injectable()
export class NpmDependencyVersionService {

  constructor(
    private octokitService: OctokitService,
    private packageLockVersionService: PackageLockVersionService,
    private yarnLockVersionService: YarnLockVersionService,
  ){
  }

  public async getReport(options: IProgramOptions) {
    const { package: packageName, org, user, deps, devDeps, peerDeps, packageLock, yarnLock } = options;

    const repos = await this.octokitService.getRepos({ org, user });

    if (!repos) {
      return null;
    }

    console.log(`NPM package to search: ${chalk.green(packageName)}`);
    const spinner = ora({ prefixText: 'Search for NPM package in every repo...' }).start();
    const result = await Promise.all(
      repos.map(repo => {
        return this.getAllDependencyVersions(
          org || user, 
          repo, 
          packageName, 
          { deps, devDeps, peerDeps, packageLock, yarnLock },
        );
      })
    );
    spinner.succeed();

    return result;
  }

  private async getAllDependencyVersions(owner: string, repo: string, depName: string, options: IPackageOptions) {
    const { deps, devDeps, peerDeps, packageLock, yarnLock } = options;

    try {
      const packageJson = await this.octokitService.getPackageJson(owner, repo);
      const depVersion = deps && this.getDependencyVersion(packageJson, depName, 'dependencies');
      const devDepVersion = devDeps && this.getDependencyVersion(packageJson, depName, 'devDependencies');
      const peerDepVersion = peerDeps && this.getDependencyVersion(packageJson, depName, 'peerDependencies');
      const version = ([
        depVersion,
        devDepVersion && `${devDepVersion} (dev)`,
        peerDepVersion && `${peerDepVersion} (peer)`
      ])
        .filter(x => x)
        .join(', ') || null;
  
      return {
        repo,
        version,
        packageLockVersion: packageLock 
          ? await this.packageLockVersionService.getVersion(owner, repo, depName).catch(() => null) 
          : null,
        yarnLockVersion: yarnLock 
          ? await this.yarnLockVersionService.getVersion(owner, repo, depName).catch(() => null) 
          : null,
      };
    }
    catch (e) {
      return {
        repo, 
        error: e.message,
      };
    }
  }

  private getDependencyVersion(packageJson, depName, field = 'dependencies') {
    const dependencies = packageJson ? packageJson[field] : null;
    const packageVersion = dependencies ? dependencies[depName] : null;
  
    return packageVersion;
  }

}