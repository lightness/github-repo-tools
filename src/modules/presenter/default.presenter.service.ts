import * as figlet from 'figlet';
import * as moment from 'moment';
import * as Octokit from '@octokit/rest';
import * as ora from 'ora';
import chalk from 'chalk';
import { Injectable, Inject } from '@nestjs/common';
import { TableService } from '../table/table.service';
import { IPresenterService } from './interfaces';
import { IReportItem, IProgramOptions } from '../../interfaces';
import { getFilter } from '../../util/result-filter';
import { Writable } from 'stream';

@Injectable()
export class DefaultPresenterService implements IPresenterService {
  private spinner: ora.Ora = null;

  constructor(
    private tableService: TableService,
    @Inject('STREAM') protected stream: Writable,
  ) {
  }

  public write(str: string) {
    this.stream.write(str+ '\n');
  }

  public configure() {
  }

  public showFiglet() {
    this.write(figlet.textSync('Github Repo Tools'));
  }

  public showGithubTokenInfo(options: IProgramOptions) {
    const withGithubToken = !!options.token;

    this.write(`Use GITHUB_TOKEN env: ${withGithubToken ? chalk.green('yes') : chalk.red('no')}`);
  }

  public showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate) {
    if (!rateLimit) {
      return;
    }

    const { limit, remaining, reset } = rateLimit;
    const resetMoment = moment(reset * 1000);
    const resetIn = resetMoment.fromNow();
    const resetAt = resetMoment.format('HH:mm');

    this.write(`Remains ${remaining}/${limit} requests. \nLimit will reset at ${resetAt} (${resetIn})`);
  }

  public showError(message: string) {
    this.write(message);
  }

  public showData(report: IReportItem[], options: IProgramOptions) {
    if (!report) {
      this.write('No data found');
      return;
    }

    const filteredReport: IReportItem[] = report.filter(getFilter(options));
    const output: string = this.tableService.format(filteredReport, options);

    this.write(output);
  }

  public showSpinner(message: string) {
    this.spinner = ora({ prefixText: message }).start();
  }

  public hideSpinner({ success, message }: { success: boolean, message: string }) {
    if (message) {
      this.spinner.prefixText = message;
    }

    if (success) {
      this.spinner.succeed();
    } else {
      this.spinner.fail();
    }
  }

  public showSearchNodeVersion({ nvm, engines }: { nvm: boolean, engines: boolean }) {
    const sources = [nvm && '.nvmrc', engines && 'package.json engines'].filter(x => x).join(' and ');

    this.write(`Search node version from ${sources}`);
  }

  public showSearchPackageVersion(packageName: string) {
    this.write(`NPM package to search: ${chalk.green(packageName)}`);
  }

}
