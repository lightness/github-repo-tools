import { IProgramOptions } from "../interfaces";

export const DEFAULT: IProgramOptions = {
  skipEmpty: true,
  skipError: [404],

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

  token: process.env.GITHUB_TOKEN,
}