import { Module } from "@nestjs/common";
import { OctokitModule } from "../octokit/octokit.module";
import { NpmDependencyVersionService } from "./npm.dependency.version.service";
import { PackageLockVersionService } from "./package.lock.version.service";
import { YarnLockVersionService } from "./yarn.lock.version.service";


@Module({
  imports: [
    OctokitModule
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
