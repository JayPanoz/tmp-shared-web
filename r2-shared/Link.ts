import { Properties } from "./epub/Properties";
import { PresentationProperties } from "./presentation/Presentation";
import { Encrypted } from "./Encrypted";

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