#!/usr/bin/env node
const program = require('commander');
const figlet = require('figlet');
const main = require('./main');
const package = require('../package.json');

console.log(figlet.textSync('Github Repo Tools'));

function collect(val, memo) {
  memo.push(...val.split(','));
  return memo;
}

program
  .version(package.version, '-v, --version')
  .description('Search npm packages in all org repos. You can set GITHUB_TOKEN env var, if public access restricted')
  .option('-o, --org <org>', 'github org where search applied')
  .option('-u, --user <user>', 'github user where search applied')
  .option('-p, --package <package>', 'package to search')
  .option('--no-deps', 'disable search in "dependencies" package.json field')
  .option('--no-dev-deps', 'disable search in "devDependencies" package.json field')
  .option('--no-peer-deps', 'disable search in "peerDependencies" package.json field')
  .option('--no-yarn-lock', 'disable search in yarn.lock')
  .option('--no-package-lock', 'disable search in package-lock.json')
  .option('--no-skip-empty', 'not skip repo, if package not found')
  .option('--skip-error <errorToSkip>', 'skip repo, if error with such code occured', collect, ['404'])
  .option('-n, --node', 'search node version based on .nvmrc and package.json engines')
  .option('--no-nvm', 'disable search in .nvmrc')
  .option('--no-engines', 'disable search in package.json engines')
  .parse(process.argv);

// console.log(program);

main(program);
