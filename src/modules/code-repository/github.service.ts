import { Injectable } from '@nestjs/common';
import * as Octokit from '@octokit/rest';
import * as RetryPlugin from '@octokit/plugin-retry';
import { Memoize } from 'lodash-decorators';
import { RepoInfo } from './repo-info';
import { ICodeRepositoryService } from './interfaces';

@Injectable()
export class GithubService implements ICodeRepositoryService {

  @Memoize()
  private getClient(token?: string) {
    return new (Octokit.plugin(RetryPlugin))({
      auth: token,
      retry: {
        doNotRetry: [404],
      }
    });
  }

  public async getFileContent(repo, path, { token, user, org }) {
    const octokit = await this.getClient(token);

    try {
      const response = await octokit.repos.getContents({
        owner: user || org,
        repo: repo.id,
        path,
      });

      let buff = Buffer.from(response.data.content, 'base64');
      let text = buff.toString('ascii');

      return text;
    } catch (e) {
      throw new Error(`${e.status}`);
    }
  }

  public async getRepos({ org, user, token }) {
    const octokit = await this.getClient(token);

    const options = org
      ? octokit.repos.listForOrg.endpoint.merge({ org })
      : octokit.repos.listForUser.endpoint.merge({ username: user });

    const repos = await octokit.paginate(options);

    return repos.map(repo => new RepoInfo(repo.name));
  }

  public async getRateLimits({ token }) {
    const octokit = await this.getClient(token);
    const response = await octokit.rateLimit.get();

    return response.data.rate;
  }

}
