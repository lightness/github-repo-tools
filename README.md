<!-- <img src="icon.png" align="right" /> -->

# Github Repo Tools

Main goal is check versions of some npm package in all repos of single github user/org.

## Examples

<img src="./doc/images/example-01.png" align="center" />

## Options description

```
$ grt -h
   ____ _ _   _           _       ____                    _____           _     
  / ___(_) |_| |__  _   _| |__   |  _ \ ___ _ __   ___   |_   _|__   ___ | |___ 
 | |  _| | __| '_ \| | | | '_ \  | |_) / _ \ '_ \ / _ \    | |/ _ \ / _ \| / __|
 | |_| | | |_| | | | |_| | |_) | |  _ <  __/ |_) | (_) |   | | (_) | (_) | \__ \
  \____|_|\__|_| |_|\__,_|_.__/  |_| \_\___| .__/ \___/    |_|\___/ \___/|_|___/
                                           |_|                                  
Usage: grt [options]

Search npm packages in all org repos. You can set GITHUB_TOKEN env var, if public access restricted

Options:
  -v, --version               output the version number
  -o, --org <org>             github org where search applied
  -u, --user <user>           github user where search applied
  -p, --package <package>     package to search
  --no-deps                   disable search in "dependencies" package.json field
  --no-dev-deps               disable search in "devDependencies" package.json field
  --no-peer-deps              disable search in "peerDependencies" package.json field
  --no-skip-empty             not skip repo, if package not found
  --skip-error <errorToSkip>  skip repo, if error with such code occured (default: ["404"])
  -n, --nvm                   search node version based on .nvmrc (TBD)
  -e, --engines               search npm engines field (TBD)
  -h, --help                  output usage information
```