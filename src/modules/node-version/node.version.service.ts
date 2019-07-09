import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces';
import { INodeVersion } from './interfaces';
import { OctokitService } from '../octokit/octokit.service';
import { PresenterService } from '../presenter/presenter.service';

@Injectable()
export class NodeVersionService {

  constructor(
    private octokitService: OctokitService,
    private presenterService: PresenterService,
  ) {
  }

  public async getReport(options: IProgramOptions): Promise<INodeVersion[]> {
    const { org, user, nvm, engines, token } = options;

    const repos = await this.octokitService.getRepos({ org, user, token });

    if (!repos) {
      return null;
    }

    this.presenterService.showSearchNodeVersion({ nvm, engines });
    this.presenterService.showSpinner(`Search in every repo...`);
    const result = await Promise.all(
      repos.map(async repo => {
        try {
          const [nvmVersion, enginesVersion] = await Promise.all([
            nvm ? this.getNvmrc(org || user, repo, token).catch(() => null) : null,
            engines ? this.getEngines(org || user, repo, token).catch(() => null) : null
          ]);

          const data: INodeVersion = { repo };

          if (nvm) {
            data.nvmVersion = nvmVersion;
          }

          if (engines) {
            data.enginesVersion = enginesVersion;
          }

          return data;
        }
        catch (e) {
          return { repo, error: e.message };
        }
      })
    );
    this.presenterService.hideSpinner({ success: true });

    return result;
  }

  private async getNvmrc(owner, repo, token): Promise<string> {
    const content = await this.octokitService.getFileContent(owner, repo, '.nvmrc', token);

    return content.trim();
  }

  private async getEngines(owner, repo, token): Promise<string> {
    const packageJson = await this.octokitService.getPackageJson(owner, repo, token);
    const engines = packageJson.engines;

    if (!engines || !engines.node) {
      return null;
    }

    return engines.npm 
      ? `${engines.node} (npm: ${engines.npm})` 
      : `${engines.node}`;
  }

}
