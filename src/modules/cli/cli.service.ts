import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces';
import { CommanderService } from './commander.service';

@Injectable()
export class CliService {

  constructor(
    private commanderService: CommanderService,
  ) {
  }

  public getProgramOptions(): IProgramOptions {
    const options = this.commanderService.getProgramOptions();

    // validate

    // use inquirer if needed

    return options;
  }

}