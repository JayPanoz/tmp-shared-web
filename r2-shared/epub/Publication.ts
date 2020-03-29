import { IPublication } from "../Publication";
import { ILink } from "../Link";

export interface IEPUBPublication extends IPublication {
  pageList?: Array<ILink>;
  landmarks?: Array<ILink>;
  loa?: Array<ILink>;
  loi?: Array<ILink>;
  lot?: Array<ILink>;
  lov?: Array<ILink>;
}