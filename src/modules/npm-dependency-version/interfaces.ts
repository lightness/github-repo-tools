import { IReportItem } from "../../interfaces";

export interface IPacakgeVersion extends IReportItem {
  version?: string;
  packageLockVersion?: string;
  yarnLockVersion?: string;
}