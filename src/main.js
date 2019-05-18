require('dotenv').config();
const chalk = require('chalk');
const searchNpmDependency = require('./command/search-npm-dependency');
const searchNodeVersion = require('./command/search-node-version');
const getRepos = require('./helper/get-repos');
const formatAsTable = require('./util/table');
const getResultFilter = require('./util/result-filter');
const getRateLimit = require('./helper/get-rate-limit');

const withGithubToken = !!process.env.GITHUB_TOKEN;

async function main(program) {
  const { org, user, skipEmpty, skipError } = program;

  if (org) {
    console.log(`Github org: ${chalk.green(org)}`);
  } else if (user) {
    console.log(`Github user: ${chalk.green(user)}`);
  } else {
    console.log('Either org or user should be specified');
    return;
  }

  console.log(`Use GITHUB_TOKEN env: ${withGithubToken ? chalk.green('yes') : chalk.red('no')}`);

  const repos = await getRepos({ org, user });
  const result = await runInMode(repos, program);

  if (result) {
    const filteredResult = result.filter(getResultFilter({ skipEmpty, skipError }));
    const noDataMessage = chalk.red('Nothing to show');
  
    console.log(formatAsTable(filteredResult, program) || noDataMessage);
  }

  console.log(await getRateLimit());
}

async function runInMode(repos, program) {
  const { package, node } = program;

  if (!repos) {
    return null;
  }

  if (node) {
    return await searchNodeVersion(repos, program);
  } else if (package) {
    return await searchNpmDependency(repos, program);
  } else {
    console.log('Specify package or nvm option');
    return null;
  }
}

module.exports = main;
