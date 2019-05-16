const ora = require('ora');
const octokit = require('../octokit');

async function getRepos({ org, user }) {
  const options = org 
    ? octokit.repos.listForOrg.endpoint.merge({ org })
    : octokit.repos.listForUser.endpoint.merge({ username: user });
  const spinner = ora({ prefixText: 'Searching for repos...' }).start();
  try {
    const repos = await octokit.paginate(options);
    spinner.text = `${repos.length} found`;
    spinner.succeed();

    return repos.map(repo => repo.name);
  }
  catch (e) {
    spinner.text = `${e.status}`;
    spinner.fail();

    return null;
  }
}

module.exports = getRepos;
