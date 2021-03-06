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

  public async getRateLimit(token?: string) {
    this.presenterService.showSpinner('Getting rate limits info');

    try {
      const octokit = this.octokitService.getOctokit(token);
      const response = await octokit.rateLimit.get();

      this.presenterService.hideSpinner({ success: true, message: 'Rate limits info received' });

      return response.data.rate;
    } catch (e) {
      this.presenterService.hideSpinner({ success: false, message: 'Rate limits not received' });
      return null;
    }
  }

}
