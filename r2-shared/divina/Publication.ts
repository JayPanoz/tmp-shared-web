import Publication from "../Publication";
import { Link } from "../Link";

export default class DivinaPublication extends Publication {
  public readonly guided?: Array<Link>;

  constructor(manifestJSON: any, manifestURL: URL) {
    super(
      manifestJSON,
      manifestURL
    )
    this.guided = manifestJSON.guided || [];
  }
}