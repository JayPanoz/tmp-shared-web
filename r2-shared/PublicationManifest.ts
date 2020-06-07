import Metadata from "./Metadata";
import Store from "../Store/Store";
import { Link, Links } from "./Link";

export default class PublicationManifest {
  public readonly context: Array<string>;
  public readonly metadata: Metadata;
  public readonly links: Links;
  public readonly readingOrder?: Links;
  public readonly resources?: Links;
  public readonly tableOfContents?: Links;

  public readonly manifestURL?: string;

  constructor(manifestJSON: any, manifestURL?: string) {
    this.context = manifestJSON["@context"] || [];
    this.metadata = new Metadata(manifestJSON.metadata);
    this.links = manifestJSON.links ? new Links(manifestJSON.links) : new Links([]);
    this.readingOrder = manifestJSON.readingOrder ? new Links(manifestJSON.readingOrder) : new Links([]);
    this.resources = manifestJSON.resources ? new Links(manifestJSON.resources) : new Links([]);
    this.tableOfContents = manifestJSON.toc ? new Links(manifestJSON.toc) : new Links([]);

    this.manifestURL = manifestURL;
  }

  // Getting/Setting Manifest

  public static async requestManifest(manifestURL: string, store?: Store): Promise<PublicationManifest> {
    const fetchRetry = async (attempts: number, delay: number): Promise<PublicationManifest> => {
      try {
        const response = await window.fetch(manifestURL, { credentials: "same-origin" });
        if(!response.ok) {
          throw new Error("Invalid response.");
        }
        const manifestJSON = await response.json();
        if (store) {
          await store.set("manifest", JSON.stringify(manifestJSON));
        }
        return new PublicationManifest(manifestJSON, manifestURL);
      } catch(err) {
        if (attempts <= 1) {
          throw err
        }
        setTimeout( () => {
          return fetchRetry(attempts - 1, 1000);
        }, delay)
      }
    }

    return fetchRetry(3, 1000);
  }

  public static async getManifest(manifestURL: string, store?: Store): Promise<PublicationManifest> {
    if (store) {
      const manifestString = await store.get("manifest");
      if (manifestString) {
        const manifestJSON = JSON.parse(manifestString);
        return new PublicationManifest(manifestJSON, manifestURL);
      } else {
        return PublicationManifest.requestManifest(manifestURL, store);
      }
    } else {
      return PublicationManifest.requestManifest(manifestURL);
    }
  }

  public static async purgeManifest(store: Store): Promise<void> {
    await store.remove("manifest");
    return new Promise<void>(resolve => resolve());
  }

  // Getting readingOrder items

  public getCoverLink(): Link | null {
    return this.linkWithRel("cover");
  }

  public getStartLink(): Link | null {
    if (this.readingOrder.length > 0) {
      return this.readingOrder[0];
    }
    return null;
  }

  public getPreviousSpineItem(href: string): Link | null {
    const index = this.getSpineIndex(href);
    if (index !== null && index > 0) {
      return this.readingOrder[index - 1];
    }
    return null;
  }

  public getNextSpineItem(href: string): Link | null {
    const index = this.getSpineIndex(href);
    if (index !== null && index < (this.readingOrder.length - 1)) {
      return this.readingOrder[index + 1];
    }
    return null;
  }

  public getSpineItem(href: string): Link | null {
    const index = this.getSpineIndex(href);
    if (index !== null) {
      return this.readingOrder[index];
    }
    return null;
  }

  public getSpineIndex(href: string): number {
    for (let index = 0; index < this.readingOrder.length; index++) {
      const item = this.readingOrder[index];
      if (item.href) {
        const itemUrl = new URL(item.href, this.manifestURL).href;
        if (itemUrl === href) {
          return index;
        }
      }
    }
    return null;
  }

  // Getting toc items

  public getTOCItem(href: string): Link | null {
    const findItem = (href: string, links: Array<Link>): Link | null => {
      for (let index = 0; index < links.length; index++) {
        const item = links[index];
        if (item.href) {
          const itemUrl = new URL(item.href, this.manifestURL).href;
          if (itemUrl === href) {
            return item;
          }
        }
        if (item.children) {
          const childItem = findItem(href, item.children);
          if (childItem !== null) {
            return childItem;
          }
        }
      }
      return null;
    }
    return findItem(href, this.tableOfContents);
  }

  public linkWithRel(rel: string): Link | null {
    let result = null;
    result = this.readingOrder.firstWithRel(rel);
    if (result !== null) {
      return result
    }
    result = this.resources.firstWithRel(rel);
    if (result !== null) {
      return result
    }
    result = this.links.firstWithRel(rel);
    return result;
  }

  public linksWithRel(rel: string): Array<Link> {
    let result = [];
    result.push(this.readingOrder.filterByRel(rel), this.resources.filterByRel(rel), this.links.filterByRel(rel));
    return result;
  }
}