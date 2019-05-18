const octokit = require('../octokit');

async function getFileContent(owner, repo, path) {
  try {
    const response = await octokit.repos.getContents({
      owner,
      repo,
      path,
    });

    let buff = Buffer.from(response.data.content, 'base64');
    let text = buff.toString('ascii');

    return text;
  } catch (e) {
    // if (e.status !== 404) {
    //   console.log(e);
    // }
    throw new Error(e.status);
  }
}

module.exports = getFileContent;
