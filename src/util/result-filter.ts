import { IFilterOptions } from "../interfaces";

export function getFilter({ skipError, skipEmpty }: IFilterOptions) {
  const filterError = ({ error }) => !error || (skipError instanceof Array ? !skipError.includes(error) : !skipError);

  // console.log(skipEmpty);
  const filterEmpty = (item) => {
    if (!skipEmpty) {
      return true;
    }

    const [repo, ...restKeys] = Object.keys(item);
    const isEmpty = restKeys.map(key => item[key]).filter(x => x).length === 0;

    return !isEmpty;
  };

  return item => {
    const x = filterEmpty(item) && filterError(item);
    // console.log(item, filterEmpty(item), filterError(item));
    return x;
  };
}
