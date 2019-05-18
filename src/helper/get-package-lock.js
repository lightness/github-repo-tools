const getFileContent = require('./get-file-content');

async function getPackageLock(owner, repo) {
  return JSON.parse(await getFileContent(owner, repo, 'package-lock.json'));
}

module.exports = getPackageLock;
