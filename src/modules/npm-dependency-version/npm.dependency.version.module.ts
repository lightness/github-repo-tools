import { Module } from '@nestjs/common';
import { NpmDependencyVersionService } from './npm.dependency.version.service';
import { PackageLockVersionService } from './package.lock.version.service';
import { YarnLockVersionService } from './yarn.lock.version.service';
import { PresenterModule } from '../presenter/presenter.module';
import { CodeRepositoryModule } from '../code-repository/code-repository.module';

@Module({
  imports: [
    CodeRepositoryModule,
    PresenterModule,
  ],
  providers: [
    NpmDependencyVersionService,
    PackageLockVersionService,
    YarnLockVersionService,
  ],
  exports: [
    NpmDependencyVersionService,
  ],
})
export class NpmDependencyVersionModule {
}
