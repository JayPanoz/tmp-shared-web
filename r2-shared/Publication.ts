import { IMetadata } from "./Metadata";
import { ILink } from "./Link";

export interface IPublication {
  context: Array<string>;
  metadata: IMetadata;
  links: Array<ILink>;
  readingOrder?: Array<ILink>;
  resources?: Array<ILink>;
  toc?: Array<ILink>;
}