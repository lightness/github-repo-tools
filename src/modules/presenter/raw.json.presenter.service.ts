import * as Octokit from '@octokit/rest';
import { Injectable } from '@nestjs/common';
import { IPresenterService } from './interfaces';
import { IReportItem, IProgramOptions } from '../../interfaces';
import { getFilter } from '../../util/result-filter';

@Injectable()
export class RawJsonPresenterService implements IPresenterService {
  protected log(data: object) {
    console.log(JSON.stringify(data));
  }

  public showFiglet() {
  }

  public showGithubTokenInfo() {
  }

  public async showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate, isMainInfo: boolean) {
    if (isMainInfo) {
      this.log(rateLimit);
    }
  }

  public showError(message: string) {
    this.log({ error: message });
  }

  public showData(report: IReportItem[], options: IProgramOptions) {
    const filteredReport: IReportItem[] = report.filter(getFilter(options));

    this.log(filteredReport);
  }

  public showSpinner() {
  }

  public hideSpinner() {
  }

  public showSearchNodeVersion() {
  }

  public showSearchPackageVersion() {
  }

}
