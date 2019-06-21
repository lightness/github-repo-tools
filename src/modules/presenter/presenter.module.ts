import { Module } from "@nestjs/common";
import { PresenterService } from "./presenter.service";
import { TableModule } from "../table/table.module";
import { DefaultPresenterService } from "./default.presenter.service";
import { JsonPresenterService } from "./json.presenter.service";
import { RawJsonPresenterService } from "./raw.json.presenter.service";

@Module({
  providers: [
    PresenterService,
    DefaultPresenterService,
    JsonPresenterService,
    RawJsonPresenterService,
  ],
  exports: [PresenterService],
  imports: [
    TableModule,
  ],
})
export class PresenterModule {
}
