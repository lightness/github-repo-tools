const Octokit = require('@octokit/rest').plugin(require('@octokit/plugin-retry'));

module.exports = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  retry: {
    doNotRetry: [ 404 ],
  }
});