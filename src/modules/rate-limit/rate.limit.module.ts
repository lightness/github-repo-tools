import { Module } from '@nestjs/common';
import { RateLimitService } from './rate.limit.service';
import { PresenterModule } from '../presenter/presenter.module';
import { CodeRepositoryModule } from '../code-repository/code-repository.module';

@Module({
  imports: [
    CodeRepositoryModule,
    PresenterModule,
  ],
  providers: [
    RateLimitService,
  ],
  exports: [
    RateLimitService,
  ],
})
export class RateLimitModule {
}
