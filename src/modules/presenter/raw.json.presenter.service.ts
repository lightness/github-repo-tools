import { Writable } from 'stream';
import { Injectable, Inject } from '@nestjs/common';
import { IPresenterService } from './interfaces';
import { IReportItem, IProgramOptions } from '../../interfaces';
import { getFilter } from '../../util/result-filter';
import { IRateLimits } from '../code-repository/interfaces';

@Injectable()
export class RawJsonPresenterService implements IPresenterService {

  public constructor(
    @Inject('STREAM') protected stream: Writable,
  ) {
  }

  protected write(data: object) {
    this.stream.write(JSON.stringify(data));
  }

  public showFiglet() {
  }

  public showTokenInfo() {
  }

  public async showRateLimit(rateLimit: IRateLimits, isMainInfo: boolean) {
    if (isMainInfo) {
      this.write(rateLimit);
    }
  }

  public showError(message: string) {
    this.write({ error: message });
  }

  public showData(report: IReportItem[], options: IProgramOptions) {
    if (!report) {
      this.write({ error: 'No data found' });
      return;
    }

    const filteredReport: IReportItem[] = report.filter(getFilter(options));

    this.write(filteredReport);
  }

  public showSpinner() {
  }

  public showProcessingSpinner() {
  }

  public hideSpinner() {
  }

}
