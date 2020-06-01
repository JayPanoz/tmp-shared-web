import { Metadata } from "./Metadata";
import { Link } from "./Link";
import { Locator } from "./Locator";
import { ReadingProgression } from "./ReadingProgression";
import * as Utils from "./utils/trimString";

interface URLParams {
  [param: string]: string
}

const rtlLanguages = ["ar", "fa", "he"];

export default class Publication {
  public readonly context: Array<string>;
  public readonly metadata: Metadata;
  public readonly links: Array<Link>;
  public readonly readingOrder?: Array<Link>;
  public readonly resources?: Array<Link>;
  public readonly toc?: Array<Link>;

  private readonly allLinks: Array<Link>;

  public readonly baseURL: string;

  constructor(manifestJSON: any, manifestURL?: string) {
    this.context = manifestJSON["@context"] || [];
    this.metadata = manifestJSON.metadata || {};
    this.links = manifestJSON.links || [];
    this.readingOrder = manifestJSON.readingOrder || [];
    this.resources = manifestJSON.resources || [];
    this.toc = manifestJSON.toc || [];

    this.allLinks = this.readingOrder.concat(this.resources, this.links);

    this.baseURL = manifestURL || this.getSelfLink();
  }

  private getSelfLink(): string {
    const selfLink = this.links.find(el => el.rel === "self");
    return selfLink.href;
  }

  // Existing methods go here…

  // readingOrder Helpers

  public anyReadingOrder(predicate: any, key?: string): boolean {
    return this.readingOrder.some(predicate);
  }

  public allReadingOrder(predicate: any, key?: string): boolean {
    return this.readingOrder.every(predicate);
  }

  public allReadingOrderIsBitmap(): boolean {
    const predicate = (el: Link) => el.type.startsWith("image");
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderIsAudio(): boolean {
    const predicate = (el: Link) => el.type.startsWith("audio");
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderIsVideo(): boolean {
    const predicate = (el: Link) => el.type.startsWith("video");
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderIsHTML(): boolean {
    const mediaTypes = ["text/html", "application/xhtml+xml"];
    const predicate = (el: Link) => mediaTypes.includes(Utils.trimString(el.type, ";"));
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderMatchesMediaType(mediaType: string): boolean {
    const predicate = (el: Link) => Utils.trimString(el.type, ";") === mediaType;
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderMatchesAnyOfMediaType(mediaType: Array<string>): boolean {
    const predicate = (el: Link) => mediaType.includes(Utils.trimString(el.type, ";")) ;
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
    const urlObject = new URL(url);
    for (const p of urlObject.searchParams) {
      urlObject.searchParams.delete(p[0]);
    }
    let result = urlObject.href;
    if (result.includes(this.baseURL)) {
      result = result.split(this.baseURL)[1];
    }
    return result;
  }

  // Link Helpers
  // Note: alternate and children checking

  public linksMatching(predicate: any): Array<Link> {
    return this.allLinks.filter(predicate);
  }

  public linkMatching(predicate: any): Link | undefined {
    return this.allLinks.find(predicate); 
  }

  public linkFromURL(url: string): Link | undefined {
    const href = this.hrefFromURL(url);
    return this.linkWithHREF(href);
  }

  public linkWithHREF(href: string): Link | undefined {
    return this.allLinks.find(el => el.href === href);
  }

  public linksWithRel(rel: string): Array<Link> {
    return this.allLinks.filter(el => el.rel === rel);
  }

  public linkWithRel(rel: string): Link | undefined {
    return this.allLinks.find(el => el.rel === rel);
  }

  public linksMatchingMediaType(mediaType: string): Array<Link> {
    return this.allLinks.filter(el => Utils.trimString(el.type, ";") === mediaType);
  }

  public linkMatchingMediaType(mediaType: string): Link | undefined {
    return this.allLinks.find(el => Utils.trimString(el.type, ";") === mediaType);
  }

  // Presentation Helpers

  public effectiveReadingProgression(): ReadingProgression {
    if (this.metadata.readingProgression && this.metadata.readingProgression !== ReadingProgression.auto) {
      return this.metadata.readingProgression;
    } else {
      if (this.metadata.language.length > 0) {
        const lang = Utils.trimString(this.metadata.language[0], "");
        if (rtlLanguages.includes(lang)) {
          ReadingProgression.rtl;
        }
      }
    }
  }
}