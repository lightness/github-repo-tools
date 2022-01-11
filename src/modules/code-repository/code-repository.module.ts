import { Module } from '@nestjs/common';
import { BitbucketService } from './bitbucket.service';
import { PresenterModule } from '../presenter/presenter.module';
import { CodeRepositoryService } from './code-repository.service';
import { GithubService } from './github.service';

@Module({
  imports: [
    PresenterModule,
  ],
  providers: [CodeRepositoryService, BitbucketService, GithubService],
  exports: [CodeRepositoryService]
})
export class CodeRepositoryModule {
}
