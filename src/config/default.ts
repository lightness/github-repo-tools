import { IProgramOptions, RepoService } from "../interfaces";

export const DEFAULT: IProgramOptions = {
  repoService: RepoService.GITHUB,

  skipEmpty: true,
  skipError: [404, '404'],

  json: false,
  rawJson: false,
  csv: false,
  md: false,

  engines: true,
  nvm: true,

  deps: true,
  devDeps: true,
  peerDeps: true,
  packageLock: true,
  yarnLock: true,
}