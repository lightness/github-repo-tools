function getFilter({ skipError, skipEmpty } = {}) {
  const filterEmpty = ({ version }) => version !== '-' || !skipEmpty;
  const filterError = ({ error }) => !error || (skipError instanceof Array ? !skipError.includes(error) : !skipError);

  return item => filterEmpty(item) && filterError(item);
}

module.exports = getFilter;
