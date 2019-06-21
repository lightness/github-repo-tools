import { Injectable } from '@nestjs/common';
import { CliService } from './modules/cli/cli.service';
import { NodeVersionService } from './modules/node-version/node.version.service';
import { INodeVersion } from './modules/node-version/interfaces';
import { IProgramOptions } from './interfaces';
import { IPacakgeVersion } from './modules/npm-dependency-version/interfaces';
import { NpmDependencyVersionService } from './modules/npm-dependency-version/npm.dependency.version.service';
import { RateLimitService } from './modules/rate-limit/rate.limit.service';
import { PresenterService } from './modules/presenter/presenter.service';
import { PresentationMode } from './modules/presenter/interfaces';

@Injectable()
export class AppService {

  constructor(
    private cliService: CliService,
    private presenterService: PresenterService,
    private rateLimitService: RateLimitService,
    private nodeVersionService: NodeVersionService,
    private npmDependencyVersionService: NpmDependencyVersionService,
  ) {
  }

  public async main() {
    const options: IProgramOptions = await this.cliService.getProgramOptions();

    this.setupPresenter(options);

    this.presenterService.showFiglet();
    this.presenterService.showGithubTokenInfo();

    const { package: packageName, node, rateLimit } = options;

    if (node) {
      return this.nodeCase(options);
    } else if (packageName) {
      return this.packageCase(options);
    } else if (rateLimit) {
      return this.showRateLimit(true);
    } else {
      this.presenterService.showError('Wrong input');
    }
  }

  private async nodeCase(options: IProgramOptions) {
    const report: INodeVersion[] = await this.nodeVersionService.getReport(options);
    this.presenterService.showData(report, options);
    this.showRateLimit(false);
  }

  private async packageCase(options: IProgramOptions) {
    const report: IPacakgeVersion[] = await this.npmDependencyVersionService.getReport(options);
    this.presenterService.showData(report, options);
    this.showRateLimit(false);
  }

  private async showRateLimit(isMainInfo: boolean) {
    const rateLimit = await this.rateLimitService.getRateLimit();

    this.presenterService.showRateLimit(rateLimit, isMainInfo);
  }

  private setupPresenter(options: IProgramOptions) {
    const presentationMode: PresentationMode = this.getPresentationMode(options);
    PresenterService.setMode(presentationMode);
  }

  private getPresentationMode(options: IProgramOptions): PresentationMode {
    const { json, rawJson } = options;

    if (rawJson) {
      return PresentationMode.RAW_JSON;
    }

    if (json) {
      return PresentationMode.JSON;
    }

    return PresentationMode.DEFAULT;
  }

}
