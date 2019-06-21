import { Module } from "@nestjs/common";
import { OctokitModule } from "../octokit/octokit.module";
import { RateLimitService } from "./rate.limit.service";
import { PresenterModule } from "../presenter/presenter.module";

@Module({
  imports: [
    OctokitModule,
    PresenterModule,
  ],
  providers: [
    RateLimitService,
  ],
  exports: [
    RateLimitService,
  ],
})
export class RateLimitModule {
}
