const ora = require('ora');
const getNvmrc = require('../helper/get-nvmrc');
const getEngines = require('../helper/get-engines');

async function searchNodeVersion(repos, program) {
  const { org, user, nvm, engines } = program;

  const sources = [nvm && '.nvmrc', engines && 'package.json engines'].filter(x => x).join(' and ');
  console.log(`Search node version from ${sources}`);

  const spinner = ora({ prefixText: `Search for ${sources} in every repo...` }).start();
  const result = await Promise.all(
    repos.map(async repo => {
      try {
        const [nvmVersion, enginesVersion] = await Promise.all([
          nvm ? getNvmrc(org || user, repo).catch(() => null) : null,
          engines ? getEngines(org || user, repo).catch(() => null) : null
        ]);

        return {
          repo,
          nvmVersion,
          enginesVersion,
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

module.exports = searchNodeVersion;
