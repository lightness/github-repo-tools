import { Injectable } from "@nestjs/common";
import * as ora from 'ora';
import { IProgramOptions } from "../../interfaces";
import { INodeVersion } from "./interfaces";
import { OctokitService } from "../octokit/octokit.service";

@Injectable()
export class NodeVersionService {

  constructor(
    private octokitService: OctokitService,
  ) {
  }

  public async getReport(options: IProgramOptions): Promise<INodeVersion[]> {
    const { org, user, nvm, engines } = options;

    const repos = await this.octokitService.getRepos({ org, user });

    if (!repos) {
      return null;
    }

    const sources = [nvm && '.nvmrc', engines && 'package.json engines'].filter(x => x).join(' and ');
    console.log(`Search node version from ${sources}`);

    const spinner = ora({ prefixText: `Search for ${sources} in every repo...` }).start();
    const result = await Promise.all(
      repos.map(async repo => {
        try {
          const [nvmVersion, enginesVersion] = await Promise.all([
            nvm ? this.getNvmrc(org || user, repo).catch(() => null) : null,
            engines ? this.getEngines(org || user, repo).catch(() => null) : null
          ]);

          return {
            repo,
            nvmVersion,
            enginesVersion,
          };
        }
        catch (e) {
          return {
            repo,
            error: e.message,
          };
        }
      })
    );
    spinner.succeed();

    return result;
  }

  private async getNvmrc(owner, repo): Promise<string> {
    const content = await this.octokitService.getFileContent(owner, repo, '.nvmrc');

    return content.trim();
  }

  private async getEngines(owner, repo): Promise<string> {
    const packageJson = await this.octokitService.getPackageJson(owner, repo);
    const engines = packageJson.engines;

    if (!engines || !engines.node) {
      return null;
    }

    return engines.npm 
      ? `${engines.node} (npm: ${engines.npm})` 
      : `${engines.node}`;
  }

}
