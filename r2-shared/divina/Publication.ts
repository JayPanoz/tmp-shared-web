import Publication from "../Publication";
import Store from "../../Store/Store";
import { Link } from "../Link";

export default class DivinaPublication extends Publication {
  public readonly guided?: Array<Link>;

  constructor(manifestJSON: any, manifestURL?: string, store?: Store) {
    super(
      manifestJSON,
      manifestURL,
      store
    )
    this.guided = manifestJSON.guided || [];
  }
}