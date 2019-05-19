import * as inquirer from 'inquirer';
import { Injectable } from '@nestjs/common';
import { IOwnerOptions, IProgramOptions, INodeOptions, IPackageOptions } from '../../interfaces';

@Injectable()
export class InquirerService {

  public async promptOwner(): Promise<IOwnerOptions> {
    const { owner } = await inquirer.prompt([
      {
        type: 'list',
        name: 'owner',
        message: `Do you want to apply search for user's or for org's repos?`,
        choices: [
          'User',
          'Org',
        ]
      },
    ]);

    switch (owner) {
      case 'User':
        return this.promptUser();
      case 'Org': 
        return this.promptOrg();
      default:
        return {};
    }
  }

  public async promptMode(): Promise<IProgramOptions> {
    const { mode } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mode',
        message: `What operation are you looking for?`,
        choices: [
          { name: 'Get node versions', value: 'node' },
          { name: 'Get npm package versions', value: 'package' },
          { name: 'Get rate limits info', value: 'rate-limits' },
        ]
      },
    ]);

    switch (mode) {
      case 'node':
        return {
          node: true,
          ...await this.promptNode(),
        }
      case 'package':
        return this.promptPackage();
      case 'rate-limits':
        return {
          rateLimit: true,
        }
      default:
        return {};
    }
  }

  private async promptNode(): Promise<INodeOptions> {
    const { nvm, engines } = await inquirer.prompt([
      {
        type: 'list',
        name: 'nvm',
        message: `Do you want to apply search in .nvrc files?`,
        default: true,
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ]
      },
      {
        type: 'list',
        name: 'engines',
        message: `Do you want to apply search in package.json engines?`,
        default: true,
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ]
      }
    ]);

    return { nvm, engines };
  }

  private async promptPackage(): Promise<IPackageOptions> {
    const { package: packageName, packageJsonFields, packageLock, yarnLock } = await inquirer.prompt([
      {
        type: 'input',
        name: 'package',
        message: `What npm package do you want to search?`
      },
      {
        type: 'checkbox',
        name: 'packageJsonFields',
        message: `Do you want to apply search in following package.json sections?`,
        choices: [
          { name: 'dependencies', value: 'deps', checked: true },
          { name: 'devDependencies', value: 'devDeps', checked: true },
          { name: 'peerDependencies', value: 'peerDeps', checked: true },
        ]
      },
      {
        type: 'list',
        name: 'packageLock',
        message: `Do you want to apply search in package-lock.json?`,
        default: true,
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ]
      },
      {
        type: 'list',
        name: 'yarnLock',
        message: `Do you want to apply search in yarn.lock?`,
        default: true,
        choices: [
          { name: 'Yes', value: true },
          { name: 'No', value: false },
        ]
      }
    ]);

    return {
      package: packageName,
      deps: packageJsonFields.includes('deps'),
      devDeps: packageJsonFields.includes('devDeps'),
      peerDeps: packageJsonFields.includes('peerDeps'),
      packageLock,
      yarnLock,
    };
  }

  private async promptUser(): Promise<IOwnerOptions> {
    const { user } = await inquirer.prompt([
      {
        type: 'input',
        name: 'user',
        message: `Enter github username`,
      },
    ]);

    return { user };
  }

  private async promptOrg(): Promise<IOwnerOptions> {
    const { org } = await inquirer.prompt([
      {
        type: 'input',
        name: 'org',
        message: `Enter github org name`,
      },
    ]);

    return { org };
  }

}