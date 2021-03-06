import Metadata from "./Metadata";
import PublicationManifest from "./PublicationManifest";
import Store from "../Store/Store";
import { Link, Links } from "./Link";

export default class Publication {
  public manifest: PublicationManifest;
  public fetcher: any | null = null; // tmp
  public services: any | null = null; // tmp

  // Aliases
  public context: Array<string> = this.manifest.context;
  public metadata: Metadata = this.manifest.metadata;
  public links: Links = this.manifest.links;
  public readingOrder: Links = this.manifest.readingOrder;
  public resources: Links = this.manifest.resources;
  public tableOfContents: Links = this.manifest.tableOfContents;

  constructor(manifest: PublicationManifest, fetcher: any | null = null, services: any | null = null) {
    this.manifest = manifest;
    this.fetcher = fetcher;
    this.services = services;
  }

  public baseURL(): string {
    if (this.manifest.manifestUrl) {
      return this.manifest.manifestUrl.split("manifest.json")[0];
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
        let arr = [];
        for (const link of item) {
          if (link.alternate) {
            arr.push(link.alternate)
          }
          if (link.children) {
            arr.push(link.children)
          }
        }
        return arr;
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

  // Deprecations

  public static async getManifest(manifestUrl: string, store?: Store): Promise<PublicationManifest> {
    return PublicationManifest.getManifest(manifestUrl, store)
  };

  public getStartLink(): Link { 
    return this.manifest.getStartLink();
  }

  public getPreviousSpineItem(href: string): Link {
    return this.manifest.getPreviousSpineItem(href);
  }

  public getNextSpineItem(href: string): Link {
    return this.manifest.getNextSpineItem(href);
  }

  public getSpineItem(href: string): Link {
    return this.manifest.getSpineItem(href);
  }

  public getSpineIndex(href: string): number {
    return this.manifest.getSpineIndex(href);
  }

  public getAbsoluteHref(href: string): string {
    return this.manifest.getAbsoluteHref(href);
  }

  public getRelativeHref(href: string): string {
    return this.manifest.getRelativeHref(href);
  }
  
  public getTOCItemAbsolute(href: string): Link {
    return this.manifest.getTOCItemAbsolute(href);
  }
  
  public getTOCItem(href: string): Link {
    return this.manifest.getTOCItem(href);
  }
}