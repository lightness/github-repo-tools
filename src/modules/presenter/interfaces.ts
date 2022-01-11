import * as Octokit from '@octokit/rest';
import { IReportItem, IProgramOptions } from '../../interfaces';

export enum PresentationMode {
  DEFAULT = 'default',
  JSON = 'json',
  RAW_JSON = 'raw-json',
  CSV = 'csv',
  MARKDOWN = 'markdown',
}

export interface IPresenterService {
  showFiglet();
  showTokenInfo(options: IProgramOptions);
  showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate, isMainInfo: boolean);
  showError(message: string);
  showData(report: IReportItem[], options: IProgramOptions);
  showSpinner(message: string);
  showProcessingSpinner(options: IProgramOptions);
  hideSpinner({ success, message }: { success: boolean, message?: string });
}
