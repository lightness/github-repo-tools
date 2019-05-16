const getFileContent = require('./get-file-content');

async function getNvmrc(owner, repo) {
  const content = await getFileContent(owner, repo, '.nvmrc');

  return content.trim();
}

module.exports = getNvmrc;
