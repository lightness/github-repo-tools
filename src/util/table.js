const Table = require('cli-table3');
const changeCase = require('change-case');

function formatAsTable(data, program) {
  const order = {
    "repo": Number.MIN_VALUE,
    "version": -10,
    "packageLockVersion": -11,
    "yarnLockVersion": -12,
    "nvmVersion": -7,
    "enginesVersion": -6,
    "error": Number.MAX_VALUE,
  }

  console.log(data);

  const fieldSet = data.reduce(
    (set, item) => {
      Object.keys(item).map(key => {
        set.add(key);
      });

      return set;
    },
    new Set(),
  );

  const fields = [...fieldSet]
    .filter((field) => {
      switch (field) {
        case 'packageLockVersion':
          return program.packageLock;
        case 'yarnLockVersion':
          return program.yarnLock;
        case 'enginesVersion':
          return program.engines;
        case 'nvmVersion':
          return program.nvm;
        default: 
          return true;
      }
    })
    .sort((fieldA, fieldB) => (order[fieldB] || 0) - (order[fieldA] || 0));

  const headers = fields.map(field => changeCase.sentenceCase(field));

  const table = new Table({
    head: headers,
  });

  const [key, ...values] = fields;

  data.forEach(item => {
    table.push({
      [item[key]]: values.map(value => item[value])
    });
  });

  return table.toString();
}

module.exports = formatAsTable;
