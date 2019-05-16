const getPackageJson = require('./get-package-json');

async function getEngines(owner, repo) {
  const packageJson = await getPackageJson(owner, repo)
  const emptyResult = '-';
  const engines = packageJson.engines;

  if (!engines || !engines.node) {
    return emptyResult;
  }

  return engines.npm ? `${engines.node} (npm: ${engines.npm})` : `${engines.node}`; Î
}

module.exports = getEngines;
