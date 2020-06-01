import { Metadata } from "./Metadata";
import { Link } from "./Link";

export interface Publication {
  context: Array<string>;
  metadata: Metadata;
  links: Array<Link>;
  readingOrder?: Array<Link>;
  resources?: Array<Link>;
  toc?: Array<Link>;
}