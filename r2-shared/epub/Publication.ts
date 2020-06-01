import { Publication } from "../Publication";
import { Link } from "../Link";

export interface EPUBPublication extends Publication {
  pageList?: Array<Link>;
  landmarks?: Array<Link>;
  loa?: Array<Link>;
  loi?: Array<Link>;
  lot?: Array<Link>;
  lov?: Array<Link>;
}