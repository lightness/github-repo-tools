import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces';
import { INodeVersion } from './interfaces';

import { PresenterService } from '../presenter/presenter.service';
import { BaseReportService } from '../base/base.report.service';
import { CodeRepositoryService } from '../code-repository/code-repository.service';
import { RepoInfo } from '../code-repository/repo-info';

@Injectable()
export class NodeVersionService extends BaseReportService<INodeVersion> {

  constructor(
    codeRepositoryService: CodeRepositoryService,
    presenterService: PresenterService,
  ) {
    super(codeRepositoryService, presenterService);
  }

  protected async handleRepo(repo: RepoInfo, options: IProgramOptions): Promise<INodeVersion> {
    const { nvm, engines } = options;

    const [nvmVersion, enginesVersion] = await Promise.all([
      nvm ? this.getNvmrc(repo, options).catch(() => null) : null,
      engines ? this.getEngines(repo, options).catch(() => null) : null
    ]);

    const data: INodeVersion = { repo: repo.name };

    if (nvm) {
      data.nvmVersion = nvmVersion;
    }

    if (engines) {
      data.enginesVersion = enginesVersion;
    }

    return data;
  }

  private async getNvmrc(repo, options): Promise<string> {
    const content = await this.codeRepositoryService.getFileContent(repo, '.nvmrc', options);

    return content.trim();
  }

  private async getEngines(repo, options): Promise<string> {
    const packageJsonContent = await this.codeRepositoryService.getFileContent(repo, 'package.json', options);
    const packageJson = JSON.parse(packageJsonContent);
    const engines = packageJson.engines;

    if (!engines || !engines.node) {
      return null;
    }

    return engines.npm 
      ? `${engines.node} (npm: ${engines.npm})` 
      : `${engines.node}`;
  }

}
