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
      return this.manifest.manifestURL.split("manifest.json")[0];
    } else {
      const selfLink = this.manifest.links.find(el => el.rel === "self");
      return selfLink.href;
    }
  };

  public linkWithHref(href: string): Link | null {
    const find = (links: Array<Links>): Link | null => {
      let result = null;

      for (const collection of links) {
        result = collection.firstWithHref(href);
        if (result !== null) {
          return result;
        }
      }

      const children: Array<Links> = links.flatMap(item => {
        let result = []; 
        if (item.alternate) {
          result.push(item.alternate)
        } 
        if (item.children) {
          result.push(item.children)
        } 
        return result;
      });

      find(children);

      return result;
    }

    const links: Array<Links> = [this.manifest.readingOrder, this.manifest.resources, this.manifest.links];
    
    const link = find(links);

    if (link !== null) {
      return link;
    }

    const shortHref = href.split(/[#\?]/)[0];

    this.linkWithHref(shortHref);

    return link;
  }

  public linkWithRel(rel: string): Link {
    return this.manifest.linkWithRel(rel);
  }

  public linksWithRel(rel: string): Array<Link> {
    return this.manifest.linksWithRel(rel);
  }
}