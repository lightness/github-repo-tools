import { Inject, Injectable } from "@nestjs/common";
import * as Octokit from "@octokit/rest";
import { Writable } from "stream";
import { Parser } from "json2csv";
import { IProgramOptions, IReportItem } from "../../interfaces";
import { getFilter } from "../../util/result-filter";
import { IPresenterService } from "./interfaces";

@Injectable()
export class CsvPresenterService implements IPresenterService {

  public constructor(
    @Inject('STREAM') protected stream: Writable,
  ) {
  }

  private convertToCsv(data: object | object[]) {
    try {
      const parser = new Parser();

      return parser.parse(data);
    } catch (err) {
      return this.convertToCsv({ error: 'Something went wrong when convering to CSV' });
    }
  }

  protected write(data: object) {
    this.stream.write(this.convertToCsv(data));
  }

  public showFiglet() {
  }

  public showGithubTokenInfo() {
  }

  public async showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate, isMainInfo: boolean) {
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