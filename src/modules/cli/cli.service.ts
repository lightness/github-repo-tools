import { Injectable } from '@nestjs/common';
import { Memoize } from 'lodash-decorators';
import { IProgramOptions } from '../../interfaces';
import { CommanderService } from './commander.service';
import { InquirerService } from './inquirer.service';
import { InputValidatorService } from './input.validator.service';
import { InvalidResult } from './interfaces';

@Injectable()
export class CliService {

  constructor(
    private inquirerService: InquirerService,
    private commanderService: CommanderService,
    private inputValidatorService: InputValidatorService,
  ) {
  }

  @Memoize()
  public getProgramOptions(): Promise<IProgramOptions> {
    const options = this.commanderService.getProgramOptions();

    return this.patchOptions(options);
  }

  public async patchOptions(options): Promise<IProgramOptions> {
    let localOptions = { ...options };
    let validationResult = await this.inputValidatorService.validate(localOptions);

    while (this.isResultInvalid(validationResult)) {
      const patch = await this.getOptionsPatch(validationResult.askAbout);
      localOptions = { ...localOptions, ...patch };

      validationResult = await this.inputValidatorService.validate(localOptions);
    }

    return localOptions;
  }

  private async getOptionsPatch(askAbout: string): Promise<Partial<IProgramOptions>> {
    switch (askAbout) {
      case 'owner':
        return this.inquirerService.promptOwner();
      case 'mode':
        return this.inquirerService.promptMode();
    }
  }

  private isResultInvalid(result): result is InvalidResult {
    return !result.valid;
  }

}
