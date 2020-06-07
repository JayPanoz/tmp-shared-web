import { Encrypted } from "./Encrypted";
import { PresentationProperties } from "./presentation/Presentation";
import { Properties } from "./epub/Properties";
import { splitString } from "./utils/splitString";

type Predicate = (el: Link) => boolean;

/*  
    Keeping as ref list of values we know are currently used, per webpub doc:
    https://github.com/readium/webpub-manifest/blob/master/relationships.md
    type LinkRel = "alternate" | "contents" | "cover" | "manifest" | "search" | "self"; 
*/

interface LinkProperties extends PresentationProperties {
  contains?: Array<Properties>;
  encrypted?: Encrypted;
  mediaOverlay?: string;
}

export interface Link {
  href: string;
  templated?: boolean;
  type?: string;
  title?: string;
  rel?: string;
  properties?: LinkProperties;
  height?: number;
  width?: number;
  duration?: number;
  bitrate?: number;
  language?: string;
  alternate?: Array<Link>;
  children?: Array<Link>;
}

export class Links extends Array<Link> {
  constructor(items?: Array<Link>) {
    super(...items);
    Object.setPrototypeOf(this, Links.prototype);
  }

  public firstWithRel(rel: string): Link | null {
    const predicate = (el: Link) => el.rel === rel;
    return this.find(predicate);
  }

  public filterByRel(rel: string): Array<Link> {
    const predicate = (el: Link) => el.rel === rel;
    return this.filter(predicate);
  }

  public firstWithHref(href: string): Link | null {
    const predicate = (el: Link) => el.href === href;
    return this.find(predicate);
  }

  public indexOfFirstWithHref(href: string): number {
    const predicate = (el: Link) => el.href === href;
    return this.findIndex(predicate);
  }

  public firstWithMediaType(mediaType: string): Link | null {
    const predicate = (el: Link) => splitString(el.type, ";") === mediaType;
    return this.find(predicate);
  }

  public filterByMediaType(mediaType: string): Array<Link> {
    const predicate = (el: Link) => splitString(el.type, ";") === mediaType;
    return this.filter(predicate);
  }

  public filterByMediaTypes(mediaTypes: Array<string>): Array<Link> {
    const predicate = (el: Link) => mediaTypes.includes(splitString(el.type, ";"));
    return this.filter(predicate);
  }

  public allAreAudio(): boolean {
    const predicate = (el: Link) => el["type"].startsWith("audio");
    return this.every(predicate);
  }

  public allAreBitmap(): boolean {
    const predicate = (el: Link) => el["type"].startsWith("image");
    return this.every(predicate);
  }

  public allAreHTML(): boolean {
    const mediaTypes = ["text/html", "application/xhtml+xml"];
    const predicate = (el: Link) => mediaTypes.includes(splitString(el["type"], ";"));
    return this.every(predicate);
  }

  public allAreVideo(): boolean {
    const predicate = (el: Link) => el["type"].startsWith("video");
    return this.every(predicate);
  }

  public allMatchMediaType(mediaType: string | Array<string>): boolean {
    if (Array.isArray(mediaType)) {
      return this.every((el: Link) => mediaType.includes(splitString(el["type"], ";")));
    } else {
      return this.every((el: Link) => splitString(el["type"], ";") === mediaType);
    }
  }
}