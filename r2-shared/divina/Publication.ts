import { Publication } from "../Publication";
import { Link } from "../Link";

export interface DivinaPublication extends Publication {
  guided?: Array<Link>;
}