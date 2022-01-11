import * as _ from 'lodash';
import { IFilterOptions } from '../interfaces';

export function getFilter({ skipError, skipEmpty }: IFilterOptions) {
  const filterError = ({ error }) => !error || (skipError instanceof Array ? !skipError.includes(error) : skipError !== error);

  const filterEmpty = (item) => {
    if (!skipEmpty) {
      return true;
    }

    const [repo, ...restKeys] = Object.keys(item);
    const isEmpty = restKeys.map(key => item[key]).filter(x => !_.isEmpty(x)).length === 0;

    return !isEmpty;
  };

  return item => filterEmpty(item) && filterError(item);
}
