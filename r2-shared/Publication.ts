import { Metadata } from "./Metadata";
import { Link } from "./Link";
import { Locator } from "./Locator";

interface URLParams {
  [param: string]: string
}

export default class Publication {
  public readonly context: Array<string>;
  public readonly metadata: Metadata;
  public readonly links: Array<Link>;
  public readonly readingOrder?: Array<Link>;
  public readonly resources?: Array<Link>;
  public readonly toc?: Array<Link>;

  public readonly baseURL: string;

  constructor(manifestJSON: any, manifestURL?: string) {
    this.context = manifestJSON["@context"] || [];
    this.metadata = manifestJSON.metadata || {};
    this.links = manifestJSON.links || [];
    this.readingOrder = manifestJSON.readingOrder || [];
    this.resources = manifestJSON.resources || [];
    this.toc = manifestJSON.toc || [];

    this.baseURL = manifestURL || this.getSelfLink();
  }

  private getSelfLink(): string {
    const selfLink = this.links.find(el => el.rel === "self");
    return selfLink.href;
  }

  // readingOrder Helpers

  private trimType(mediaType?: string): string {
    if (mediaType) {
      const components = mediaType.split(";");
      return components[0];
    }
  }

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
    const predicate = (el: Link) => mediaTypes.includes(this.trimType(el.type));
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderMatchesMediaType(mediaType: string): boolean {
    const predicate = (el: Link) => this.trimType(el.type) === mediaType;
    return this.allReadingOrder(predicate);
  }

  public allReadingOrderMatchesAnyOfMediaType(mediaType: Array<string>): boolean {
    const predicate = (el: Link) => mediaType.includes(this.trimType(el.type)) ;
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
}