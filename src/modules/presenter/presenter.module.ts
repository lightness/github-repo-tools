import { Module } from '@nestjs/common';
import { PresenterService } from './presenter.service';
import { TableModule } from '../table/table.module';
import { DefaultPresenterService } from './default.presenter.service';
import { JsonPresenterService } from './json.presenter.service';
import { RawJsonPresenterService } from './raw.json.presenter.service';
import { CsvPresenterService } from './csv.presenter.service';
import { MarkdownPresenterService } from './markdown.presenter.service';

@Module({
  providers: [
    PresenterService,
    DefaultPresenterService,
    JsonPresenterService,
    RawJsonPresenterService,
    CsvPresenterService,
    MarkdownPresenterService,
  ],
  exports: [PresenterService],
  imports: [
    TableModule,
  ],
})
export class PresenterModule {
}
