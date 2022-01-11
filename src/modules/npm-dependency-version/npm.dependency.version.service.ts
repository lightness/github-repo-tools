import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces';
import { PackageLockVersionService } from './package.lock.version.service';
import { YarnLockVersionService } from './yarn.lock.version.service';
import { PresenterService } from '../presenter/presenter.service';
import { IPacakgeVersion as IPackageVersion } from './interfaces';
import { BaseReportService } from '../base/base.report.service';
import { CodeRepositoryService } from '../code-repository/code-repository.service';
import { RepoInfo } from '../code-repository/repo-info';

@Injectable()
export class NpmDependencyVersionService extends BaseReportService<IPackageVersion> {

  constructor(
    codeRepositoryService: CodeRepositoryService,
    presenterService: PresenterService,
    private packageLockVersionService: PackageLockVersionService,
    private yarnLockVersionService: YarnLockVersionService,
  ) {
    super(codeRepositoryService, presenterService);
  }

  protected async handleRepo(repo: RepoInfo, options: IProgramOptions): Promise<IPackageVersion> {
    const { deps, devDeps, peerDeps, packageLock, yarnLock, package: packageName } = options;

    const packageJsonContent = await this.codeRepositoryService.getFileContent(repo, 'package.json', options);
    const packageJson = JSON.parse(packageJsonContent);
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

    const data: IPackageVersion = { repo: repo.name, version };

    if (packageLock) {
      data.packageLockVersion = await this.packageLockVersionService.getVersion(repo, packageName, options).catch(() => null);
    }

    if (yarnLock) {
      data.yarnLockVersion = await this.yarnLockVersionService.getVersion(repo, packageName, options).catch(() => null);
    }

    return data;
  }

  private getDependencyVersion(packageJson, depName, field = 'dependencies') {
    const dependencies = packageJson ? packageJson[field] : null;
    const packageVersion = dependencies ? dependencies[depName] : null;

    return packageVersion;
  }

}
