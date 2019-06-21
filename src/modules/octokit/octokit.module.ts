import { Module } from "@nestjs/common";
import { OctokitService } from "./octokit.service";
import { PresenterModule } from "../presenter/presenter.module";

@Module({
  imports: [
    PresenterModule,
  ],
  providers: [OctokitService],
  exports: [OctokitService]
})
export class OctokitModule {
}
