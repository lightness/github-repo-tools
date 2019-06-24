import { Injectable } from '@nestjs/common';
import * as Octokit from '@octokit/rest';
import { PresentationMode, IPresenterService } from './interfaces';
import { DefaultPresenterService } from './default.presenter.service';
import { JsonPresenterService } from './json.presenter.service';
import { IReportItem, IProgramOptions } from '../../interfaces';
import { RawJsonPresenterService } from './raw.json.presenter.service';

@Injectable()
export class PresenterService implements IPresenterService {
  private static mode: PresentationMode = PresentationMode.DEFAULT;

  public static setMode(mode: PresentationMode) {
    PresenterService.mode = mode;
  }

  constructor(
    private defaultPresenterService: DefaultPresenterService,
    private jsonPresenterService: JsonPresenterService,
    private rawJsonPresenterService: RawJsonPresenterService,
  ) {
  }

  private get presenter(): IPresenterService {
    switch (PresenterService.mode) {
      case PresentationMode.RAW_JSON:
        return this.rawJsonPresenterService;
      case PresentationMode.JSON:
        return this.jsonPresenterService;
      case PresentationMode.DEFAULT:
      default:
        return this.defaultPresenterService;
    }
  }

  public showFiglet() {
    this.presenter.showFiglet();
  }

  public showGithubTokenInfo(options: IProgramOptions) {
    this.presenter.showGithubTokenInfo(options);
  }

  public showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate, isMainInfo: boolean) {
    this.presenter.showRateLimit(rateLimit, isMainInfo);
  }

  public showError(message) {
    this.presenter.showError(message);
  }

  public showData(report: IReportItem[], options: IProgramOptions) {
    this.presenter.showData(report, options);
  }

  public showSpinner(message: string) {
    this.presenter.showSpinner(message);
  }

  public hideSpinner({ success, message }: { success: boolean, message?: string }) {
    this.presenter.hideSpinner({ success, message });
  }

  public showSearchNodeVersion({ nvm, engines }: { nvm: boolean, engines: boolean }) {
    this.presenter.showSearchNodeVersion({ nvm, engines });
  }

  public showSearchPackageVersion(packageName: string) {
    this.presenter.showSearchPackageVersion(packageName);
  }

}
