# Github Repo Tools

Main goal is check versions of some npm package in all repos of single github user/org.

## Examples

#### You can specify command line arguments

<img src="https://pp.userapi.com/c850016/v850016709/18fee1/JwKo9KOnzBg.jpg" align="center" />

#### Or just answer some questions

<img src="https://pp.userapi.com/c850728/v850728163/122ff9/Mant09kj4M4.jpg" align="center" />

#### Some usage examples:

```sh
# Search node version from .nvmrc
grt -u <github-user> -n

# Search npm package in package.json
grt -u <github-user> -p <npm-package>

# Search npm package just in package.json "devDependencies" field
grt -u <github-user> -p <npm-package> --no-deps --no-peer-deps

# Show rate limits
grt -l

# Show report in pretty json format
grt -o <github-org> -n --json

# Show report in raw json format without whitespaces
grt -o <github-org> -n --raw-json

# Show report about npm package in Bitbucket repos (workspace and token)
grt -R bitbucket -w <bitbucket-workspace> -t <bitbucker-user:app-password> -p <npm-package>
```

## Usage

```
$ grt -h
Search npm packages in all org/workspace repos. You can set token via env var,
if public access restricted

Owner:
  --repo-service, -R  code repository service (github, bitbucket)
                                                    [string] [default: "github"]
  --user, -u          user name (github)                                [string]
  --org, -o           org name (github)                                 [string]
  --workspace, -w     workspace name (bitbucket)                        [string]
  --repos, -r         repos where search applied                         [array]
  --token, -t         token to auth. Env var strongly recommented       [string]
  --token-name, --tn  name of env variable with token. GITHUB_TOKEN /
                      BITBUCKET_TOKEN by default.                       [string]

NPM package:
  --package, -p   package to search                                     [string]
  --deps          disable search in "dependencies" package.json field
                                                       [boolean] [default: true]
  --dev-deps      disable search in "devDependencies" package.json field
                                                       [boolean] [default: true]
  --peer-deps     disable search in "peerDependencies" package.json field
                                                       [boolean] [default: true]
  --yarn-lock     disable search in yarn.lock          [boolean] [default: true]
  --package-lock  disable search in package-lock.json  [boolean] [default: true]

Node version:
  --node, -n  search node version based on .nvmrc and package.json engines
  --nvm       disable search in .nvmrc                 [boolean] [default: true]
  --engines   disable search in package.json engines   [boolean] [default: true]

Options:
  -v, --version     Show version number                                [boolean]
  --rate-limit, -l  show rate limit
  --skip-empty      skip repo, if package/node not found
                                                       [boolean] [default: true]
  --skip-error      skip repo, if error with such code occured
                                                  [array] [default: [404,"404"]]
  --raw-json        show output as json without whitespaces
                                                      [boolean] [default: false]
  --json            show output as prettified json    [boolean] [default: false]
  --csv             show output as csv                [boolean] [default: false]
  --md              show output as markdown table     [boolean] [default: false]
  -h, --help        Show help                                          [boolean]
```

## Use in your app

```js
const { grt } = require('github-repo-tools');

const response = await grt({ 
  user: 'lightness',
  package: 'typescript',
  yarnLock: false,
  token: '<GITHUB_TOKEN>',
});
```

> TODO: Add more descriptive exmaple