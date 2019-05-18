const lockfile = require('@yarnpkg/lockfile');
const getFileContent = require('./get-file-content');

async function getYarnLock(owner, repo) {
  const content = await getFileContent(owner, repo, 'yarn.lock');

  return lockfile.parse(content);
}

module.exports = getYarnLock;
