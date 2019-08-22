import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { IProgramOptions, IPackageOptions } from '../../interfaces';
import { OctokitService } from '../octokit/octokit.service';
import { PackageLockVersionService } from './package.lock.version.service';
import { YarnLockVersionService } from './yarn.lock.version.service';
import { PresenterService } from '../presenter/presenter.service';
import { IPacakgeVersion as IPackageVersion } from './interfaces';
import { BaseReportService } from '../base/base.report.service';

@Injectable()
export class NpmDependencyVersionService extends BaseReportService<IPackageVersion> {

  constructor(
    octokitService: OctokitService,
    presenterService: PresenterService,
    private packageLockVersionService: PackageLockVersionService,
    private yarnLockVersionService: YarnLockVersionService,
  ) {
    super(octokitService, presenterService);
  }

  protected async handleRepo(repo: string, options: IProgramOptions): Promise<IPackageVersion> {
    const { deps, devDeps, peerDeps, packageLock, yarnLock, user, org, token, package: packageName } = options;
    const owner = user || org;

    const packageJson = await this.octokitService.getPackageJson(owner, repo, token);
    const depVersion = deps && this.getDependencyVersion(packageJson, packageName, 'dependencies');
    const devDepVersion = devDeps && this.getDependencyVersion(packageJson, packageName, 'devDependencies');
    const peerDepVersion = peerDeps && this.getDependencyVersion(packageJson, packageName, 'peerDependencies');
    const version = ([
      depVersion,
      devDepVersion && `${devDepVersion} (dev)`,
      peerDepVersion && `${peerDepVersion} (peer)`
    ])
      .filter(x => x)
      .join(', ') || null;

    const data: IPackageVersion = { repo, version };

    if (packageLock) {
      data.packageLockVersion = await this.packageLockVersionService.getVersion(owner, repo, packageName, token).catch(() => null);
    }

    if (yarnLock) {
      data.yarnLockVersion = await this.yarnLockVersionService.getVersion(owner, repo, packageName, token).catch(() => null);
    }

    return data;
  }

  private getDependencyVersion(packageJson, depName, field = 'dependencies') {
    const dependencies = packageJson ? packageJson[field] : null;
    const packageVersion = dependencies ? dependencies[depName] : null;

    return packageVersion;
  }

}
