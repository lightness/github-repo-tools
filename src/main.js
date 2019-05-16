require('dotenv').config();
const chalk = require('chalk');
const searchNpmDependency = require('./command/search-npm-dependency');
const searchNodeDependency = require('./command/search-node-version');
const searchEnginesVersion = require('./command/search-engines-version');
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
  
    console.log(formatAsTable(filteredResult));
  }

  console.log(await getRateLimit());
}

async function runInMode(repos, program) {
  const { package, nvm, engines } = program;

  if (!repos) {
    return null;
  }

  if (nvm) {
    return await searchNodeDependency(repos, program);
  } else if (engines) {
    return await searchEnginesVersion(repos, program);
  } else if (package) {
    return await searchNpmDependency(repos, program);
  } else {
    console.log('Specify package or nvm option');
    return null;
  }
}

module.exports = main;
