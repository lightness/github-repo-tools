import { Module } from "@nestjs/common";
import { CliService } from "./cli.service";
import { CommanderService } from "./commander.service";

@Module({
  providers: [
    CliService,
    CommanderService,
  ],
  exports: [
    CliService,
  ]
})
export class CliModule {
}
