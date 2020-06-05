import { Metadata } from "./Metadata";
import { Link } from "./Link";
import { Locator } from "./Locator";
import { ReadingProgression } from "./ReadingProgression";
import Store from "../Store/Store";
import * as Utils from "./utils/splitString";

interface URLParams {
  [param: string]: string
}

type Predicate = (Link: Link) => boolean;

enum PublicationCacheKeys {
  audio = "allReadingOrderIsAudio",
  bitmap = "allReadingOrderIsBitmap",
  html = "allReadingOrderIsHTML",
  video = "allReadingOrderIsVideo"
}

export default class Publication {
  public readonly context: Array<string>;
  public readonly metadata: Metadata;
  public readonly links: Array<Link>;
  public readonly readingOrder?: Array<Link>;
  public readonly resources?: Array<Link>;
  public readonly tableOfContents?: Array<Link>;

  private readonly allLinks: Array<Link>;

  public readonly baseURL: string;
  private store?: Store;

  private static readonly RTLLanguages = ["ar", "fa", "he", "zh-Hant", "zh-TW"];

  constructor(manifestJSON: any, manifestURL?: string, store?: Store) {
    this.context = manifestJSON["@context"] || [];
    this.metadata = manifestJSON.metadata || {};
    this.links = manifestJSON.links || [];
    this.readingOrder = manifestJSON.readingOrder || [];
    this.resources = manifestJSON.resources || [];
    this.tableOfContents = manifestJSON.toc || [];

    this.allLinks = this.readingOrder.concat(this.resources, this.links);

    this.baseURL = manifestURL || this.getSelfLink();
    this.store = store;
  }

  private getSelfLink(): string {
    const selfLink = this.links.find(el => el.rel === "self");
    return selfLink.href;
  }

  // Getting/Setting Manifest

  public static async requestManifest(manifestURL: string, store?: Store): Promise<Publication> {
    const fetchRetry = async (attempts: number, delay: number): Promise<Publication> => {
      try {
        const response = await window.fetch(manifestURL, { credentials: "same-origin" });
        if(!response.ok) {
          throw new Error("Invalid response.");
        }
        const manifestJSON = await response.json();
        if (store) {
          await store.set("manifest", JSON.stringify(manifestJSON));
          return new Publication(manifestJSON, manifestURL, store);
        }
        return new Publication(manifestJSON, manifestURL);
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

  public static async getManifest(manifestURL: string, store?: Store): Promise<Publication> {
    if (store) {
      const manifestString = await store.get("manifest");
      if (manifestString) {
        const manifestJSON = JSON.parse(manifestString);
        return new Publication(manifestJSON, manifestURL, store);
      } else {
        return Publication.requestManifest(manifestURL, store);
      }
    } else {
      return Publication.requestManifest(manifestURL);
    }
  }

  public static async purgeManifest(store: Store): Promise<void> {
    await store.remove("manifest");
    return new Promise<void>(resolve => resolve());
  }

  // Getting readingOrder items

  public getCoverLink(): Link | null {
    const coverLink = this.linkWithRel("cover");
    if (coverLink) {
      return coverLink;
    }
    return null;
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
        const itemUrl = new URL(item.href, this.baseURL).href;
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
          const itemUrl = new URL(item.href, this.baseURL).href;
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

  // readingOrder Helpers

  public async anyReadingOrder(predicate: Predicate, key?: string): Promise<boolean> {
    if (key) {
      const found = await this.getCache(key);
      if (found !== null) {
        return new Promise<boolean>(resolve => resolve(JSON.parse(found)));
      }
    }
    const result = this.readingOrder.some(predicate);
    if (key) {
      await this.setCache(key, JSON.stringify(result));
    }
    return new Promise<boolean>(resolve => resolve(result));
  }

  public async allReadingOrder(predicate: Predicate, key?: string): Promise<boolean> {
    if (key) {
      const found = await this.getCache(key);
      if (found !== null) {
        return new Promise<boolean>(resolve => resolve(JSON.parse(found)));
      }
    }
    const result = this.readingOrder.every(predicate);
    if (key) {
      await this.setCache(key, JSON.stringify(result));
    }
    return new Promise<boolean>(resolve => resolve(result));
  }

  public async allReadingOrderIsAudio(): Promise<boolean> {
    const predicate = (el: Link) => el.type.startsWith("audio");
    return this.allReadingOrder(predicate, PublicationCacheKeys.audio);
  }

  public async allReadingOrderIsBitmap(): Promise<boolean> {
    const predicate = (el: Link) => el.type.startsWith("image");
    return this.allReadingOrder(predicate, PublicationCacheKeys.bitmap);
  }

  public async allReadingOrderIsHTML(): Promise<boolean> {
    const mediaTypes = ["text/html", "application/xhtml+xml"];
    const predicate = (el: Link) => mediaTypes.includes(Utils.splitString(el.type, ";"));
    return this.allReadingOrder(predicate, PublicationCacheKeys.html);
  }

  public async allReadingOrderIsVideo(): Promise<boolean> {
    const predicate = (el: Link) => el.type.startsWith("video");
    return this.allReadingOrder(predicate, PublicationCacheKeys.video);
  }

  public async allReadingOrderMatchesMediaType(mediaType: string): Promise<boolean> {
    const predicate = (el: Link) => Utils.splitString(el.type, ";") === mediaType;
    return this.allReadingOrder(predicate);
  }

  public async allReadingOrderMatchesAnyOfMediaType(mediaType: Array<string>): Promise<boolean> {
    const predicate = (el: Link) => mediaType.includes(Utils.splitString(el.type, ";")) ;
    return this.allReadingOrder(predicate);
  }

  // URL Helpers

  public urlToLink(link: Link, parameters?: URLParams): string {
    const absoluteURL = new URL(link.href, this.baseURL);
    if (parameters) {
      for (const p in parameters) {
        absoluteURL.searchParams.append(p, parameters[p]);
      }
    }
    return absoluteURL.href;
  }

  public urlToLocator(locator: Locator): string {
    const absoluteURL = new URL(locator.href, this.baseURL);
    return absoluteURL.href;
  }

  public hrefFromURL(url: string): string {
    const urlObject = new URL(url, this.baseURL);
    for (const key of urlObject.searchParams.keys()) {
      urlObject.searchParams.delete(key);
    }
    let result = urlObject.href;
    if (result.includes(this.baseURL)) {
      result = result.split(this.baseURL)[1];
    }
    return result;
  }

  // Link Helpers
  // Note: alternate and children checking

  private deepFind(collection: Array<Link>, predicate: Predicate): Link | null {
    for (const el of collection) {
      if (predicate(el)) {
        return el;
      } else if (el.alternate) {
        this.deepFind(el.alternate, predicate);
      }
    }
    return null;
  }

  private link(predicate: Predicate): Link | null {
    let result: Link | null = this.deepFind(this.readingOrder, predicate);
    if (result !== null) {
      return result;
    }
    result = this.deepFind(this.resources, predicate);
    if (result !== null) {
      return result;
    }
    result = this.deepFind(this.links, predicate);
    return result;
  }

  public linksMatching(predicate: Predicate): Array<Link> {
    return this.allLinks.filter(predicate);
  }

  public linkMatching(predicate: Predicate): Link | null {
    return this.link(predicate); 
  }

  public linkFromURL(url: string): Link | null {
    const href = this.hrefFromURL(url);
    return this.linkWithHREF(href);
  }

  public linkWithHREF(href: string): Link | null {
    return this.link(el => el.href === href);
  }

  public linksWithRel(rel: string): Array<Link> {
    return this.allLinks.filter(el => el.rel === rel);
  }

  public linkWithRel(rel: string): Link | null {
    return this.link(el => el.rel === rel);
  }

  public linksMatchingMediaType(mediaType: string): Array<Link> {
    return this.allLinks.filter(el => Utils.splitString(el.type, ";") === mediaType);
  }

  public linkMatchingMediaType(mediaType: string): Link | null {
    return this.link(el => Utils.splitString(el.type, ";") === mediaType);
  }

  // Presentation Helpers

  public effectiveReadingProgression(): ReadingProgression {
    if (this.metadata.readingProgression && this.metadata.readingProgression !== ReadingProgression.auto) {
      return this.metadata.readingProgression;
    } else {
      if (this.metadata.language.length > 0) {
        const primaryLang = this.metadata.language[0];
        const lang = (primaryLang.includes("zh") ? primaryLang : Utils.splitString(primaryLang, "-"));
        if (Publication.RTLLanguages.includes(lang)) {
          ReadingProgression.rtl;
        }
      }
    }
  }

  // Cache

  private async getCache(key: string): Promise<string | null> {
    let value: string | null = null;
    if (this.store) {
      value = await this.store.get(key);
    }
    return new Promise<string | null>(resolve => resolve(value));
  }

  private async setCache(key: string, value: string): Promise<void> {
    if (this.store) {
      await this.store.set(key, value);
    }
    return new Promise<void>(resolve => resolve());
  }
}