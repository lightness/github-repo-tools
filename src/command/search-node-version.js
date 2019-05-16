const ora = require('ora');
const getNvmrc = require('../helper/get-nvmrc');

async function searchNodeDependency(repos, program) {
  const { org, user } = program;
  
  console.log(`Search node version from .nvmrc`);
  const spinner = ora({ prefixText: 'Search for .nvmrc in every repo...' }).start();
  const result = await Promise.all(
    repos.map(async repo => {
      try {
        const version = await getNvmrc(org || user, repo);

        return {
          repo,
          version,
        };
      }
      catch (e) {
        return {
          repo,
          error: e.message,
        };
      }
    })
  );
  spinner.succeed();

  return result;
}

module.exports = searchNodeDependency;
