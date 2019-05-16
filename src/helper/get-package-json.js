const getFileContent = require('./get-file-content');

async function getPackageJson(owner, repo) {
  return JSON.parse(await getFileContent(owner, repo, 'package.json'));
}

module.exports = getPackageJson;
