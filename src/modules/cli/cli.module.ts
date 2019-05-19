import { Module } from "@nestjs/common";
import { CliService } from "./cli.service";
import { CommanderService } from "./commander.service";
import { InquirerService } from "./inquirer.service";
import { InputValidatorService } from "./input.validator.service";

@Module({
  providers: [
    CliService,
    InquirerService,
    CommanderService,
    InputValidatorService,
  ],
  exports: [
    CliService,
  ]
})
export class CliModule {
}
