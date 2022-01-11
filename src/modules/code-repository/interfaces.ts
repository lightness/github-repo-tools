import { IProgramOptions } from "../../interfaces";
import { RepoInfo } from "./repo-info";

export interface IRateLimits {
  limit: number;
  remaining: number;
  reset: number;
}

export interface ICodeRepositoryService {
  getFileContent(repo: RepoInfo, path: string, options: IProgramOptions): Promise<string>;
  getRepos(options: IProgramOptions): Promise<RepoInfo[] | null>;
  getRateLimits(options: IProgramOptions): Promise<IRateLimits | null>;
}
