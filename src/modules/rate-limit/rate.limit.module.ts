import { Module } from "@nestjs/common";
import { OctokitModule } from "../octokit/octokit.module";
import { RateLimitService } from "./rate.limit.service";

@Module({
  imports: [
    OctokitModule,
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
