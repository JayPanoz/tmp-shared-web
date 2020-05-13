import { Layout } from "./epub/Layout";
import { Properties } from "./epub/Properties"
import { Orientation, Overflow, Page, Spread} from "./presentation/Presentation";
import { IEncrypted } from "./Encrypted";

/*  
    Keeping as ref list of values we know are currently used, per webpub doc:
    https://github.com/readium/webpub-manifest/blob/master/relationships.md
    type LinkRel = "alternate" | "contents" | "cover" | "manifest" | "search" | "self"; 
*/

interface ILinkProperties {
  contains?: Array<Properties>;
  encrypted?: IEncrypted;
  layout?: Layout;
  mediaOverlay?: string;
  orientation?: Orientation;
  overflow?: Overflow;
  page?: Page;
  spread?: Spread;
}

export interface ILink {
  href: string;
  templated?: boolean;
  type?: string;
  title?: string;
  rel?: string;
  properties?: ILinkProperties;
  height?: number;
  width?: number;
  duration?: number;
  bitrate?: number;
  language?: string;
  alternate?: Array<ILink>;
  children?: Array<ILink>;
}