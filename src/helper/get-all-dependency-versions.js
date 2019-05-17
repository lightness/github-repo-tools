const getPackageJson = require('./get-package-json');
const getDependencyVersion = require('./get-dependency-version');

async function getAllDependencyVersions(owner, repo, depName, options) {
  const { fields = { deps: true } } = options;

  try {
    const packageJson = await getPackageJson(owner, repo)
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
