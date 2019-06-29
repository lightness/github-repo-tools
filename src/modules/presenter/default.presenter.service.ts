import * as figlet from 'figlet';
import * as moment from 'moment';
import * as Octokit from '@octokit/rest';
import * as ora from 'ora';
import chalk from 'chalk';
import { Injectable } from '@nestjs/common';
import { TableService } from '../table/table.service';
import { IPresenterService } from './interfaces';
import { IReportItem, IProgramOptions } from '../../interfaces';
import { getFilter } from '../../util/result-filter';
import { CliService } from '../cli/cli.service';

@Injectable()
export class DefaultPresenterService implements IPresenterService {
  private spinner: ora.Ora = null;

  constructor (
    private tableService: TableService,
  ) {
  }

  public configure() {
  }

  public showFiglet() {
    console.log(figlet.textSync('Github Repo Tools'));
  }

  public showGithubTokenInfo(options: IProgramOptions) {
    const withGithubToken = !!options.token;

    console.log(`Use GITHUB_TOKEN env: ${withGithubToken ? chalk.green('yes') : chalk.red('no')}`);
  }

  public showRateLimit(rateLimit: Octokit.RateLimitGetResponseRate) {
    if (!rateLimit) {
      return;
    }

    const { limit, remaining, reset } = rateLimit;
    const resetMoment = moment(reset * 1000);
    const resetIn = resetMoment.fromNow();
    const resetAt = resetMoment.format('HH:mm');

    console.log(`Remains ${remaining}/${limit} requests. \nLimit will reset at ${resetAt} (${resetIn})`);
  }

  public showError(message: string) {
    console.log(message);
  }

  public showData(report: IReportItem[], options: IProgramOptions) {
    if (!report) {
      console.log('No data found');
      return;
    }

    const filteredReport: IReportItem[] = report.filter(getFilter(options));
    const output: string = this.tableService.format(filteredReport, options);

    console.log(output);
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

    console.log(`Search node version from ${sources}`);
  }

  public showSearchPackageVersion(packageName: string) {
    console.log(`NPM package to search: ${chalk.green(packageName)}`);
  }

}
