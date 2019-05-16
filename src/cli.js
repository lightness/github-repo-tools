#!/usr/bin/env node
const program = require('commander');
const figlet = require('figlet');
const main = require('./main');

console.log(figlet.textSync('Github Repo Tools'));

function collect(val, memo) {
  memo.push(...val.split(','));
  return memo;
}

program
  .version('1.0.0', '-v, --version')
  .description('Search npm packages in all org repos. You can set GITHUB_TOKEN env var, if public access restricted')
  .option('-o, --org <org>', 'github org where search applied')
  .option('-u, --user <user>', 'github user where search applied')
  .option('-p, --package <package>', 'package to search')
  .option('--no-deps', 'disable search in "dependencies" package.json field')
  .option('--no-dev-deps', 'disable search in "devDependencies" package.json field')
  .option('--no-peer-deps', 'disable search in "peerDependencies" package.json field')
  .option('--no-skip-empty', 'not skip repo, if package not found')
  .option('--skip-error <errorToSkip>', 'skip repo, if error with such code occured', collect, ['404'])
  .option('-n, --nvm', 'search node version based on .nvmrc (TBD)')
  .option('-e, --engines', 'search npm engines field (TBD)')
  .parse(process.argv);

// console.log(program);

main(program);
