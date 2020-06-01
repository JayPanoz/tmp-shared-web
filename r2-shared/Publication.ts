import { Metadata } from "./Metadata";
import { Link } from "./Link";

export default class Publication {
  public readonly context: Array<string>;
  public readonly metadata: Metadata;
  public readonly links: Array<Link>;
  public readonly readingOrder?: Array<Link>;
  public readonly resources?: Array<Link>;
  public readonly toc?: Array<Link>;

  public readonly baseURL: string;

  constructor(manifestJSON: any, manifestURL: string) {
    this.context = manifestJSON["@context"] || [];
    this.metadata = manifestJSON.metadata || {};
    this.links = manifestJSON.links || [];
    this.readingOrder = manifestJSON.readingOrder || [];
    this.resources = manifestJSON.resources || [];
    this.toc = manifestJSON.toc || [];

    this.baseURL = manifestURL;
  }
}