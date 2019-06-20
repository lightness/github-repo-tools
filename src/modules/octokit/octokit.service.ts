import { Injectable } from "@nestjs/common";
import * as Octokit from '@octokit/rest';
import * as RetryPlugin from '@octokit/plugin-retry';
import * as ora from 'ora';

@Injectable()
export class OctokitService {

  private octokitInstance: Octokit;

  public get octokit() {
    if (!this.octokitInstance) {
      this.octokitInstance = new (Octokit.plugin(RetryPlugin))({
        auth: process.env.GITHUB_TOKEN,
        retry: {
          doNotRetry: [404],
        }
      });
    }

    return this.octokitInstance;
  }

  public async getFileContent(owner, repo, path) {
    try {
      const response = await this.octokit.repos.getContents({
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

  public async getPackageJson(owner, repo) {
    return JSON.parse(await this.getFileContent(owner, repo, 'package.json'));
  }

  public async getRepos({ org, user }: { org: string, user: string }): Promise<string[] | null> {
    const options = org
      ? this.octokit.repos.listForOrg.endpoint.merge({ org })
      : this.octokit.repos.listForUser.endpoint.merge({ username: user });

    const spinner = ora({ prefixText: 'Searching for repos...' }).start();
    try {
      const repos = await this.octokit.paginate(options);
      spinner.text = `${repos.length} found`;
      spinner.succeed();

      return repos.map(repo => repo.name);
    }
    catch (e) {
      spinner.text = `${e.status}`;
      spinner.fail();

      return null;
    }
  }

}
