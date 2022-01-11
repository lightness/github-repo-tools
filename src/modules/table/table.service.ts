import { Injectable } from '@nestjs/common';
import * as Table from 'cli-table3';
import * as changeCase from 'change-case';
import { IProgramOptions, IReportItem } from '../../interfaces';

@Injectable()
export class TableService {

  private readonly ORDER = Object.freeze({
    'repo': Number.MAX_SAFE_INTEGER,
    'version': 20,
    'packageLockVersion': 19,
    'yarnLockVersion': 18,
    'nvmVersion': 7,
    'enginesVersion': 6,
    'error': 100,
  });

  private readonly TRANSFORMER = Object.freeze({
    'packageLockVersion': versions => versions && versions.join('\n'),
    'yarnLockVersion': versions => versions && versions.join('\n'),
  });

  public format(data: IReportItem[], options: IProgramOptions): string {
    const fieldSet = data.reduce(
      (set, item) => {
        Object.keys(item).map(key => {
          set.add(key);
        });
  
        return set;
      },
      new Set<string>(),
    );
  
    const fields = [...fieldSet]
      .filter(this.filterSkippedColumns(options))
      .sort(this.orderColumns());

    const headers = fields.map(field => changeCase.sentenceCase(field));
  
    const table = new Table({
      head: headers,
    });
  
    const [key, ...values] = fields;
  
    data.forEach(item => {
      table.push({
        [item[key] as string]: values.map(value => this.transform(item[value], value))
      } as any);
    });
  
    return table.toString();
  }

  private transform(value, key) {
    return this.TRANSFORMER[key]
      ? this.TRANSFORMER[key](value)
      : value;
  }

  private filterSkippedColumns(options: IProgramOptions) {
    return (field) => {
      switch (field) {
        case 'packageLockVersion':
          return options.packageLock;
        case 'yarnLockVersion':
          return options.yarnLock;
        case 'enginesVersion':
          return options.engines;
        case 'nvmVersion':
          return options.nvm;
        default: 
          return true;
      }
    };
  }

  private orderColumns() {
    return (fieldA, fieldB) => (this.ORDER[fieldB] || 0) - (this.ORDER[fieldA] || 0);
  }

}
