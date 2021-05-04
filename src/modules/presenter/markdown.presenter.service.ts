import { Inject, Injectable } from "@nestjs/common";
import * as Octokit from "@octokit/rest";
import { Writable } from "stream";
import * as json2md from "json2md";
import { isArray, first, keys, mapValues } from "lodash";
import { IProgramOptions, IReportItem } from "../../interfaces";
import { getFilter } from "../../util/result-filter";
import { IPresenterService } from "./interfaces";

@Injectable()
export class MarkdownPresenterService implements IPresenterService {

  public constructor(
    @Inject('STREAM') protected stream: Writable,
  ) {
  }

  private isArray(obj): obj is object[] {
    return isArray(obj);
  }
 
  private convertToMardown(data: object | object[]) {
    const headers = keys(this.isArray(data) ? first(data) : data);
    const rows = (this.isArray(data) ? data : [data]).map(
      row => mapValues(row, (value) => value || ''),
    );

    return json2md([
      {
        table: {
          headers,
          rows,
        }
      }
    ])
  }

  protected write(data: object) {
    this.stream.write(this.convertToMardown(data));
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