import { Injectable } from '@nestjs/common';
import * as Octokit from '@octokit/rest';
import * as RetryPlugin from '@octokit/plugin-retry';
import { Memoize } from 'lodash-decorators';
import { PresenterService } from '../presenter/presenter.service';

@Injectable()
export class OctokitService {

  constructor(
    private presentationService: PresenterService,
  ) {
  }

  @Memoize()
  public getOctokit(token?: string) {
    return new (Octokit.plugin(RetryPlugin))({
      auth: token,
      retry: {
        doNotRetry: [404],
      }
    });
  }

  public async getFileContent(owner, repo, path, token?: string) {
    const octokit = await this.getOctokit(token);

    try {
      const response = await octokit.repos.getContents({
        owner,
        repo,
        path,
      });

      let buff = Buffer.from(response.data.content, 'base64');
      let text = buff.toString('ascii');

      return text;
    } catch (e) {
      throw new Error(e.status);
    }
  }

  public async getPackageJson(owner, repo, token?: string) {
    return JSON.parse(await this.getFileContent(owner, repo, 'package.json', token));
  }

  public async getRepos({ org, user, token }: { org: string, user: string, token?: string }): Promise<string[] | null> {
    const octokit = await this.getOctokit(token);

    const options = org
      ? octokit.repos.listForOrg.endpoint.merge({ org })
      : octokit.repos.listForUser.endpoint.merge({ username: user });

    this.presentationService.showSpinner('Searching for repos...');
    try {
      const repos = await octokit.paginate(options);
      this.presentationService.hideSpinner({ success: true, message: `${repos.length} repos found` });

      return repos.map(repo => repo.name);
    }
    catch (e) {
      this.presentationService.hideSpinner({ success: false, message: `${e.status}` });

      return null;
    }
  }

}
