import { Injectable } from '@nestjs/common';
import { IProgramOptions } from '../../interfaces';
import { CodeRepositoryService } from '../code-repository/code-repository.service';
import { PresenterService } from '../presenter/presenter.service';

@Injectable()
export class RateLimitService {

  constructor(
    private codeRepositoryService: CodeRepositoryService,
    private presenterService: PresenterService,
  ) {
  }

  public async getRateLimit(options: IProgramOptions) {
    this.presenterService.showSpinner('Getting rate limits info');

    try {
      const rateLimits = await this.codeRepositoryService.getRateLimits(options);
      this.presenterService.hideSpinner(
        rateLimits 
          ? { success: true, message: 'Rate limits info received' }
          : { success: false, message: 'Rate limits not received' }
      );

      return rateLimits;
    } catch (e) {
      this.presenterService.hideSpinner({ success: false, message: 'Rate limits not received' });
      return null;
    }
  }

}
