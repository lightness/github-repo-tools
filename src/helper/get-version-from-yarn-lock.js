const getYarnLock = require('./get-yarn-lock');

const depRegex = /^(.+)\@(.+)$/;

async function getVersionFromYarnLock(owner, repo, packageName) {
  const doc = await getYarnLock(owner, repo);

  if (doc.type !== 'success') {
    return null;
  }

  const dependencies = Object.keys(doc.object);

  const versionHash = dependencies
    .reduce(
      (acc, dep) => {
        const [full, depName, depVersion] = dep.match(depRegex);

        if (depName === packageName) {
          acc[depVersion] = doc.object[dep].version;
        }

        return acc;
      },
      {},
    );

  const versionUsed = [];

  const versions = dependencies
    .map(dep => {
      const requiredVersion = doc.object[dep].dependencies && doc.object[dep].dependencies[packageName];

      if (!requiredVersion) {
        return null;
      }

      const version = versionHash[requiredVersion];

      versionUsed.push(version);

      return {
        host: dep,
        version,
      };
    })
    .filter(x => x);

  const versionsUnusedInDeps = Object.values(versionHash).filter(v => !versionUsed.includes(v));
  const allVersions = [
    ...versions, 
    ...versionsUnusedInDeps.map(version => ({
      host: '<root>',
      version,
    }))
  ];

  return allVersions.map(({ host, version }) => `${version} for ${host}`).join('\n');
}

module.exports = getVersionFromYarnLock;
