import * as Octokit from '@octokit/rest';
import { IReportItem, IProgramOptions } from '../../interfaces';

export enum PresentationMode {
  DEFAULT = 'default',
  JSON = 'json',
  RAW_JSON = 'raw-json',
}

export interface IPresenterService {
  showFiglet();
  showGithubTokenInfo(options: IProgramOptions);
  showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate, isMainInfo: boolean);
  showError(message: string);
  showData(report: IReportItem[], options: IProgramOptions);
  showSpinner(message: string);
  showProcessingSpinner(options: IProgramOptions);
  hideSpinner({ success, message }: { success: boolean, message?: string });
}
