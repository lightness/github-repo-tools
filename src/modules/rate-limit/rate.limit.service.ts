import { Injectable } from '@nestjs/common';
import { OctokitService } from '../octokit/octokit.service';
import { PresenterService } from '../presenter/presenter.service';

@Injectable()
export class RateLimitService {

  constructor(
    private octokitService: OctokitService,
    private presenterService: PresenterService,
  ) {
  }

  public async getRateLimit() {
    this.presenterService.showSpinner('Getting rate limits info');

    const octokit = await this.octokitService.getOctokit();
    const response = await octokit.rateLimit.get();

    this.presenterService.hideSpinner({ success: true, message: 'Rate limits info received' });

    return response.data.rate;
  }

}
