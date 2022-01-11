import * as yargs from 'yargs';
import { Injectable } from '@nestjs/common';
import { RepoService, IProgramOptions } from '../../interfaces';
import { DEFAULT } from '../../config/default';

@Injectable()
export class CommanderService {

  public getProgramOptions(): IProgramOptions {
    const argv = yargs
      .usage('Search npm packages in all org/workspace repos. You can set token via env var, if public access restricted')
      .help('help')
      .alias('h', 'help')
      .showHelpOnFail(false, 'Specify --help for available options')
      .version()
      .alias('v', 'version')
      .describe('v', 'show version information')
      .option('repo-service', {
        alias: 'R',
        describe: 'code repository service (github, bitbucket)',
        type: 'string',
        default: DEFAULT.repoService,
      })
      .option('org', {
        alias: 'o',
        describe: 'org name (github)',
        type: 'string',
      })
      .option('user', {
        alias: 'u',
        describe: 'user name (github)',
        type: 'string',
      })
      .options('workspace', {
        alias: 'w',
        describe: 'workspace name (bitbucket)',
        type: 'string',
      })
      .option('repos', {
        alias: 'r',
        describe: 'repos where search applied',
        type: 'array',
      })
      .option('package', {
        alias: 'p',
        describe: 'package to search',
        type: 'string',
      })
      .option('deps', {
        describe: 'disable search in "dependencies" package.json field',
        default: DEFAULT.deps,
        type: 'boolean',
      })
      .option('dev-deps', {
        describe: 'disable search in "devDependencies" package.json field',
        default: DEFAULT.devDeps,
        type: 'boolean',
      })
      .option('peer-deps', {
        describe: 'disable search in "peerDependencies" package.json field',
        default: DEFAULT.peerDeps,
        type: 'boolean',
      })
      .option('yarn-lock', {
        describe: 'disable search in yarn.lock',
        default: DEFAULT.yarnLock,
        type: 'boolean',
      })
      .option('package-lock', {
        describe: 'disable search in package-lock.json',
        default: DEFAULT.packageLock,
        type: 'boolean',
      })
      .option('node', {
        alias: 'n',
        describe: 'search node version based on .nvmrc and package.json engines',
      })
      .options('nvm', {
        describe: 'disable search in .nvmrc',
        default: DEFAULT.nvm,
        type: 'boolean',
      })
      .options('engines', {
        describe: 'disable search in package.json engines',
        default: DEFAULT.engines,
        type: 'boolean',
      })
      .option('rate-limit', {
        alias: 'l',
        describe: 'show rate limit',
      })
      .option('skip-empty', {
        describe: 'skip repo, if package/node not found',
        default: DEFAULT.skipEmpty,
        type: 'boolean',
      })
      .option('skip-error', {
        describe: 'skip repo, if error with such code occured',
        default: DEFAULT.skipError,
        type: 'array'
      })
      .option('raw-json', {
        describe: 'show output as json without whitespaces',
        default: DEFAULT.rawJson,
        type: 'boolean',
      })
      .option('json', {
        describe: 'show output as prettified json',
        default: DEFAULT.json,
        type: 'boolean',
      })
      .option('csv', {
        describe: 'show output as csv',
        default: DEFAULT.csv,
        type: 'boolean',
      })
      .option('md', {
        describe: 'show output as markdown table',
        default: DEFAULT.md,
        type: 'boolean',
      })
      .option('token', {
        alias: 't',
        describe: 'token to auth. Env var strongly recommented',
        type: 'string'
      })
      .option('token-name', {
        alias: 'tn',
        describe: 'name of env variable with token. GITHUB_TOKEN / BITBUCKET_TOKEN by default.',
        type: 'string'
      })
      .group(['repo-service', 'user', 'org', 'workspace', 'repos', 'token', 'token-name'], 'Owner:')
      .group(['package', 'deps', 'dev-deps', 'peer-deps', 'yarn-lock', 'package-lock'], 'NPM package:')
      .group(['node', 'nvm', 'engines'], 'Node version:')
      .check(this.validation)
      .argv;

    return argv as IProgramOptions;
  }

  validation(argv: IProgramOptions) {
    const { user, org, repoService, token, tokenName } = argv;

    if (user && org) {
      throw new Error('You should specify either user or org. Not both');
    }

    if (token && tokenName) {
      throw new Error('You should specify either token or token name. Not both');
    }

    if (!Object.values(RepoService).includes(repoService)) {
      throw new Error('Only github and bitbucket are supported');
    }

    return true;
  }

}
