import { Module } from "@nestjs/common";
import { OctokitModule } from "../octokit/octokit.module";
import { NpmDependencyVersionService } from "./npm.dependency.version.service";
import { PackageLockVersionService } from "./package.lock.version.service";
import { YarnLockVersionService } from "./yarn.lock.version.service";
import { PresenterModule } from "../presenter/presenter.module";


@Module({
  imports: [
    OctokitModule,
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
