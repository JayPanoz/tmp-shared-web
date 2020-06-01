import Publication from "../Publication";
import { Link } from "../Link";

export default class EPUBPublication extends Publication {
  public readonly pageList?: Array<Link>;
  public readonly landmarks?: Array<Link>;
  public readonly loa?: Array<Link>;
  public readonly loi?: Array<Link>;
  public readonly lot?: Array<Link>;
  public readonly lov?: Array<Link>;

  constructor(manifestJSON: any, manifestURL: URL) {
    super(
      manifestJSON,
      manifestURL
    )
    this.pageList = manifestJSON.pageList || [];
    this.landmarks = manifestJSON.landmarks || [];
    this.loa = manifestJSON.loa || [];
    this.loi = manifestJSON.loi || [];
    this.lot = manifestJSON.lot || [];
    this.lov = manifestJSON.lov || [];
  }
}