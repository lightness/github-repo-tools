const ora = require('ora');
const chalk = require('chalk');
const getAllDependencyVersions = require('../helper/get-all-dependency-versions');

async function searchNpmDependency(repos, program) {
  const { package, org, user, deps, devDeps, peerDeps, packageLock, yarnLock } = program;

  console.log(`NPM package to search: ${chalk.green(package)}`);
  const spinner = ora({ prefixText: 'Search for NPM package in every repo...' }).start();
  const result = await Promise.all(
    repos.map(repo => {
      const options = { fields: { deps, devDeps, peerDeps }, packageLock, yarnLock };
      return getAllDependencyVersions(org || user, repo, package, options);
    })
  );
  spinner.succeed();

  return result;
}

module.exports = searchNpmDependency;
