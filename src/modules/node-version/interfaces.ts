import { IReportItem } from "../../interfaces";

export interface INodeVersion extends IReportItem {
  nvmVersion?: string;
  enginesVersion?: string;
}