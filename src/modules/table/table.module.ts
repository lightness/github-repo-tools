import { Module } from '@nestjs/common';
import { TableService } from './table.service';

@Module({
  providers: [TableService],
  exports: [TableService],
})
export class TableModule {
}
