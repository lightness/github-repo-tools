const ora = require('ora');
const getEngines = require('../helper/get-engines');

async function searchEnginesVersion(repos, program) {
  const { org, user } = program;
  
  console.log(`Search node and npm versions from package.json engines`);
  const spinner = ora({ prefixText: 'Search for package.json engines in every repo...' }).start();
  const result = await Promise.all(
    repos.map(async repo => {
      try {
        const version = await getEngines(org || user, repo);
        
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

module.exports = searchEnginesVersion;
