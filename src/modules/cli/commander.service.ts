import * as yargs from 'yargs';
import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces.js';

@Injectable()
export class CommanderService {

  public getProgramOptions(): IProgramOptions {
    const argv = yargs
      .usage('Search npm packages in all org repos. You can set GITHUB_TOKEN env var, if public access restricted')
      .help('help')
      .alias('h', 'help')
      .showHelpOnFail(false, "Specify --help for available options")
      .version()
      .alias('v', 'version')
      .describe('v', 'show version information')
      .option('org', {
        alias: 'o',
        describe: 'github org where search applied',
        type: 'string',
      })
      .option('user', {
        alias: 'u',
        describe: 'github user where search applied',
        type: 'string',
      })
      .option('package', {
        alias: 'p',
        describe: 'package to search',
        type: 'string',
      })
      .option('deps', {
        describe: 'disable search in "dependencies" package.json field',
        default: true,
        type: 'boolean',
      })
      .option('dev-deps', {
        describe: 'disable search in "devDependencies" package.json field',
        default: true,
        type: 'boolean',
      })
      .option('peer-deps', {
        describe: 'disable search in "peerDependencies" package.json field',
        default: true,
        type: 'boolean',
      })
      .option('yarn-lock', {
        describe: 'disable search in yarn.lock',
        default: true,
        type: 'boolean',
      })
      .option('package-lock', {
        describe: 'disable search in package-lock.json',
        default: true,
        type: 'boolean',
      })
      .option('node', {
        alias: 'n',
        describe: 'search node version based on .nvmrc and package.json engines',
      })
      .options('nvm', {
        describe: 'disable search in .nvmrc',
        default: true,
        type: 'boolean',
      })
      .options('engines', {
        describe: 'disable search in package.json engines',
        default: true,
        type: 'boolean',
      })
      .option('rate-limit', {
        alias: 'l',
        describe: 'show rate limit',
      })
      .option('skip-empty', {
        describe: 'skip repo, if package/node not found',
        default: true,
        type: 'boolean',
      })
      .option('skip-error', {
        describe: 'skip repo, if error with such code occured',
        default: [404],
        type: 'array'
      })
      .option('raw-json', {
        describe: 'show output as json without whitespaces',
        default: false,
        type: 'boolean',
      })
      .option('json', {
        describe: 'show output as prettified json',
        default: false,
        type: 'boolean',
      })
      .check(this.validation)
      .argv;

    return argv as IProgramOptions;
  }

  validation(argv: IProgramOptions) {
    const { user, org } = argv;

    if (user && org) {
      throw new Error('You should specify either user or org. Not both');
    }

    return true;
  }

}
