const getPackageJson = require('./get-package-json');
const getDependencyVersion = require('./get-dependency-version');
const getVersionFromPackageLock = require('./get-version-from-package-lock');
const getVersionFromYarnLock = require('./get-version-from-yarn-lock');

async function getAllDependencyVersions(owner, repo, depName, options) {
  const { fields = { deps: true }, packageLock, yarnLock } = options;

  try {
    const packageJson = await getPackageJson(owner, repo);
    const depVersion = fields.deps && getDependencyVersion(packageJson, depName, 'dependencies');
    const devDepVersion = fields.devDeps && getDependencyVersion(packageJson, depName, 'devDependencies');
    const peerDepVersion = fields.peerDeps && getDependencyVersion(packageJson, depName, 'peerDependencies');
    const version = ([
      depVersion,
      devDepVersion && `${devDepVersion} (dev)`,
      peerDepVersion && `${peerDepVersion} (peer)`
    ])
      .filter(x => x)
      .join(', ') || null;

    return {
      repo,
      version,
      packageLockVersion: packageLock ? await getVersionFromPackageLock(owner, repo, depName).catch(() => null) : null,
      yarnLockVersion: yarnLock ? await getVersionFromYarnLock(owner, repo, depName).catch(() => null) : null,
    };
  }
  catch (e) {
    return {
      repo, 
      error: e.message,
    };
  }
}

module.exports = getAllDependencyVersions;
