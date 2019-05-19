import * as moment from 'moment';
import * as ora from 'ora';
import { Injectable } from "@nestjs/common";
import { OctokitService } from "../octokit/octokit.service";

@Injectable()
export class RateLimitService {

  constructor(
    private octokitService: OctokitService
  ) {
  }

  public async getInfo() {
    const { limit, remaining, reset } = await this.getRateLimit();
    const resetMoment = moment(reset * 1000);
    const resetIn = resetMoment.fromNow();
    const resetAt = resetMoment.format('HH:mm');

    return `Remains ${remaining}/${limit} requests. \nLimit will reset at ${resetAt} (${resetIn})`;
  }

  public async getRateLimit() {
    const spinner = ora({ prefixText: 'Getting rate limits info' }).start();

    const response = await this.octokitService.octokit.rateLimit.get();

    spinner.prefixText = 'Rate limits info received';
    spinner.succeed();

    return response.data.rate;
  }

}
