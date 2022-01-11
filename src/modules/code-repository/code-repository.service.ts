import { Injectable } from '@nestjs/common';
import { IProgramOptions, RepoService } from '../../interfaces';
import { PresenterService } from '../presenter/presenter.service';
import { BitbucketService } from './bitbucket.service';
import { GithubService } from './github.service';
import { ICodeRepositoryService, IRateLimits } from './interfaces';

@Injectable()
export class CodeRepositoryService implements ICodeRepositoryService {

  constructor(
    private presentationService: PresenterService,
    private githubService: GithubService,
    private bitbucketService: BitbucketService,
  ) {
  }

  private getService(repoService: RepoService): ICodeRepositoryService {
    switch (repoService) {
      case RepoService.GITHUB:
        return this.githubService;
      case RepoService.BITBUCKET:
        return this.bitbucketService;
      default:
        throw new Error('Wrong repo service value');
    }
  }

  public async getFileContent(repo, path, options: IProgramOptions) {
    return this.getService(options.repoService).getFileContent(repo, path, options);
  }

  public async getRepos(options: IProgramOptions) {
    try {
      this.presentationService.showSpinner('Searching for repos...');
      const repos = await this.getService(options.repoService).getRepos(options);
      this.presentationService.hideSpinner({ success: true, message: `${repos.length} repos found` });
      
      return repos;
    }
    catch (e) {
      this.presentationService.hideSpinner({ success: false, message: `${e.status}` });

      return null;
    }
  }

  public async getRateLimits(options: IProgramOptions) {
    return this.getService(options.repoService).getRateLimits(options);
  }

}
