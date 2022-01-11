import { Injectable } from '@nestjs/common';
import { Bitbucket } from 'bitbucket';
import { Memoize } from 'lodash-decorators';
import { IProgramOptions } from '../../interfaces';
import { ICodeRepositoryService, IRateLimits } from './interfaces';
import { RepoInfo } from './repo-info';

@Injectable()
export class BitbucketService implements ICodeRepositoryService {

  @Memoize()
  private getClient({ token }: IProgramOptions) {
    const bitbucketConfig = {
      notice: false
    };

    if (token) {
      const [username, password] = token.split(':');

      bitbucketConfig['auth'] = {
        username,
        password,
      };
    }

    const bitbucket = new Bitbucket(bitbucketConfig);

    return bitbucket;
  }

  private async getRepoRoot(repoId: string, options) {
    const client = this.getClient(options);
    const response = await client.source.readRoot({
      workspace: options.workspace,
      fields: 'values.commit.hash,values.path,values.type',
      repo_slug: repoId,
    });
  
    const { commit: { hash: commitHash } } = response.data.values[0];
  
    const content = response.data.values.map(({ path, type }) => {
      return {
        path,
        type: type === 'commit_directory' ? 'dir' : 'file'
      }
    })
  
    return { commitHash, content };
  }

  public async getRepos(options: IProgramOptions) {
    const client = this.getClient(options);
    const response = await client.repositories.list({
      workspace: options.workspace,
      fields: 'values.slug,values.name',
      pagelen: 100,
    });
  
    return response.data.values.map((repo) => {
      return new RepoInfo(repo.slug as string, repo.name);
    });
  }

  public async getFileContent(repo: RepoInfo, path: string, options: IProgramOptions): Promise<string> {
    const client = this.getClient(options);
    
    try {
      const { commitHash } = await this.getRepoRoot(repo.id, options);
      const response = await client.source.read({
        path,
        commit: commitHash,
        workspace: options.workspace,
        repo_slug: repo.id,
      });

      return response.data as string;
    } catch (e) {
      throw new Error(`${e.status}`);
    }
  }

  public async getRateLimits(options: IProgramOptions) {
    return null;
  }

}
