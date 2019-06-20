import { Injectable } from "@nestjs/common";
import * as Table from 'cli-table3';
import * as changeCase from 'change-case';
import { IProgramOptions, IReportItem } from "../../interfaces";

@Injectable()
export class TableService {

  private readonly ORDER = Object.freeze({
    "repo": Number.MIN_VALUE,
    "version": -10,
    "packageLockVersion": -11,
    "yarnLockVersion": -12,
    "nvmVersion": -7,
    "enginesVersion": -6,
    "error": Number.MAX_VALUE,
  });

  public format(data: IReportItem[], options: IProgramOptions): string {
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
      .filter(this.filterSkippedColumns(options))
      .sort(this.orderColumns());
  
    const headers = fields.map(field => changeCase.sentenceCase(field));
  
    const table = new Table({
      head: headers,
    });
  
    const [key, ...values] = fields;
  
    data.forEach(item => {
      table.push({
        [item[key] as string]: values.map(value => item[value])
      } as any);
    });
  
    return table.toString();
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
