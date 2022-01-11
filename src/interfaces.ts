export enum RepoService {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket'
}

export interface IFilterOptions {
  skipEmpty?: boolean;
  skipError?: (number | string)[];
}

export interface IGithubOwnerOptions {
  org?: string;
  user?: string;
}

export interface IBitbucketOwnerOptions {
  workspace?: string;
}

export interface ITokenOptions {
  token?: string;
  tokenName?: string;
}

export interface IOwnerOptions extends IGithubOwnerOptions, IBitbucketOwnerOptions {
  repos?: string[];
  repoService?: RepoService;
}

export interface IPackageOptions {
  package?: string;
  deps?: boolean;
  devDeps?: boolean;
  peerDeps?: boolean;
  packageLock?: boolean;
  yarnLock?: boolean;
}

export interface INodeOptions {
  node?: boolean;
  nvm?: boolean;
  engines?: boolean;
}

export interface IPresenterOptions {
  json?: boolean;
  rawJson?: boolean;
  csv?: boolean;
  md?: boolean;
}

export interface IProgramOptions extends IFilterOptions, IOwnerOptions, IPackageOptions, INodeOptions, IPresenterOptions, ITokenOptions {
  rateLimit?: boolean;
}

export interface IReportItem {
  repo: string;
  error?: string;
}
