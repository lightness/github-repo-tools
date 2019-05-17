const getPackageJson = require('./get-package-json');

async function getEngines(owner, repo) {
  const packageJson = await getPackageJson(owner, repo);
  const engines = packageJson.engines;

  if (!engines || !engines.node) {
    return null;
  }

  return engines.npm ? `${engines.node} (npm: ${engines.npm})` : `${engines.node}`;
}

module.exports = getEngines;
