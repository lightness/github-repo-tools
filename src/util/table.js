var Table = require('cli-table3');

function formatAsTable(data) {
  const hasErrors = data.some(item => item.error);
  const table = hasErrors 
    ? getTableWithErrors(data)
    : getTableWithoutErrors(data);

  return table.toString();
}

function getTableWithErrors(data) {
  const table = new Table({
    head: ["Repo", "Version", "Error"]
  });

  data.forEach(item => {
    table.push({
      [item.repo]: [item.version, item.error]
    });
  });

  return table;
}

function getTableWithoutErrors(data) {
  const table = new Table({
    head: ["Repo", "Version"]
  });

  data.forEach(item => {
    table.push({
      [item.repo]: [item.version]
    });
  });

  return table;
}

module.exports = formatAsTable;
