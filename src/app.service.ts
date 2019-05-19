import { Injectable } from "@nestjs/common";
import { CliService } from "./modules/cli/cli.service";
import { NodeVersionService } from "./modules/node-version/node.version.service";
import { INodeVersion } from "./modules/node-version/interfaces";
import { IProgramOptions, IReportItem } from "./interfaces";
import { TableService } from "./modules/table/table.service";
import { getFilter } from "./util/result-filter";
import { IPacakgeVersion } from "./modules/npm-dependency-version/interfaces";
import { NpmDependencyVersionService } from "./modules/npm-dependency-version/npm.dependency.version.service";
import { RateLimitService } from "./modules/rate-limit/rate.limit.service";

@Injectable()
export class AppService {

  constructor(
    private cliService: CliService,
    private tableService: TableService,
    private rateLimitService: RateLimitService,
    private nodeVersionService: NodeVersionService,
    private npmDependencyVersionService: NpmDependencyVersionService,
  ) {
  }

  public async main() {
    const options = this.cliService.getProgramOptions();
    const { package: packageName, node, rateLimit } = options;

    if (node) {
      return this.nodeCase(options);
    } else if (packageName) {
      return this.packageCase(options);
    } else if (rateLimit) {
      return this.showRateLimit();
    } else {
      console.log('Wrong input');
    }
  }

  private async nodeCase(options: IProgramOptions) {
    const report: INodeVersion[] = await this.nodeVersionService.getReport(options);
    this.handleReport(report, options);
    this.showRateLimit();
  }

  private async packageCase(options: IProgramOptions) {
    const report: IPacakgeVersion[] = await this.npmDependencyVersionService.getReport(options);
    this.handleReport(report, options);
    this.showRateLimit();
  }

  private handleReport(report: IReportItem[], options: IProgramOptions) {
    const filteredReport: INodeVersion[] = report.filter(getFilter(options))
    const output: string = this.tableService.format(filteredReport, options);

    console.log(output);
  }

  private async showRateLimit() {
    console.log(await this.rateLimitService.getInfo());
  }

}