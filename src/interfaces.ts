export interface IFilterOptions {
  skipEmpty?: boolean;
  skipError?: number[];
}

export interface IOwnerOptions {
  org?: string;
  user?: string;
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
  json?: number;
  rawJson?: boolean;
}

export interface IProgramOptions extends IFilterOptions, IOwnerOptions, IPackageOptions, INodeOptions, IPresenterOptions {
  rateLimit?: boolean;
  token?: string;
}

export interface IReportItem {
  repo: string;
  error?: string;
}
