import PublicationManifest from "./PublicationManifest";
import Metadata from "./Metadata";
import { Link, Links } from "./Link";

export default class Publication {
  public manifest: PublicationManifest;
  public fetcher: any; // tmp
  public services: any; // tmp

  public context: Array<string> = this.manifest.context;
  public metadata: Metadata = this.manifest.metadata;
  public links: Links = this.manifest.links;
  public readingOrder: Links = this.manifest.readingOrder;
  public resources: Links = this.manifest.resources;
  public tableOfContents: Links = this.manifest.tableOfContents;

  constructor(manifest: PublicationManifest, fetcher: any, services: any) {
    this.manifest = manifest;
    this.fetcher = fetcher;
    this.services = services;
  }

  public baseURL(): string {
    if (this.manifest.manifestURL) {
      return this.manifest.manifestURL;
    } else {
      const selfLink = this.manifest.links.find(el => el.rel === "self");
      return selfLink.href;
    }
  };

  public linkWithHref(href: string): Link | null {
    let result = null;
    result = this.manifest.readingOrder.firstWithHref(href);
    if (result !== null) {
      return result
    }
    result = this.manifest.resources.firstWithHref(href);
    if (result !== null) {
      return result
    }
    result = this.manifest.links.firstWithHref(href);
    if (result !== null) {
      return result;
    }
    const shortHref = href.split(/[#\?]/)[0];
    result = this.manifest.readingOrder.firstWithHref(shortHref);
    if (result !== null) {
      return result
    }
    result = this.manifest.resources.firstWithHref(shortHref);
    if (result !== null) {
      return result
    }
    result = this.manifest.links.firstWithHref(shortHref);
    return result;
  }

  public linkWithRel(rel: string): Link {
    return this.manifest.linkWithRel(rel);
  }

  public linksWithRel(rel: string): Array<Link> {
    return this.manifest.linksWithRel(rel);
  }
}