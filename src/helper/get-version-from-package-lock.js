const get = require('lodash/get');
const getPackageLock = require('./get-package-lock');

async function getVersionFromPackageLock(owner, repo, packageName) {
  const packageLock = await getPackageLock(owner, repo);
  const rootVersion = get(packageLock, `dependencies.${packageName}.version`, null);

  if (!rootVersion) {
    return rootVersion;
  }

  let isRootVersionUsed = false;

  const versions = Object.keys(packageLock.dependencies)
    .map((dep) => {
      const isRequired = get(packageLock, `dependencies.${dep}.requires.${packageName}`, null);

      if (!isRequired) {
        return null;
      }

      const innerVersion = get(packageLock, `dependencies.${dep}.dependencies.${packageName}.version`, null);

      if (!innerVersion) {
        isRootVersionUsed = true;
      }

      return {
        host: dep,
        version: innerVersion || rootVersion,
      };
    })
    .filter((item) => item);

  if (!isRootVersionUsed) {
    versions.push({
      host: '<root>',
      version: rootVersion,
    })
  }

  return versions.map(({ host, version }) => `${version} for ${host}`).join('\n');
}

module.exports = getVersionFromPackageLock;
