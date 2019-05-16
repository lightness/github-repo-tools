const moment = require('moment');
const octokit = require('../octokit');

async function getRateLimit() {
  const response = await octokit.rateLimit.get();

  const { rate: { remaining, limit, reset } } = response.data;
  const resetMoment = moment(reset * 1000);
  const resetIn = resetMoment.fromNow();
  const resetAt = resetMoment.format('HH:mm');

  return `Remains ${remaining}/${limit} requests. Limit will reset at ${resetAt} (${resetIn})`;
}

module.exports = getRateLimit;
