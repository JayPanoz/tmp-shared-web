import { Layout } from "./epub/Layout";
import { Properties } from "./epub/Properties"
import { Orientation, Overflow, Page, Spread} from "./presentation/Presentation";
import { IEncrypted } from "./Encrypted";

type LinkRel = "alternate" | "contents" | "cover" | "manifest" | "search" | "self";

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
  rel?: LinkRel;
  properties?: ILinkProperties;
  height?: number;
  width?: number;
  duration?: number;
  bitrate?: number;
  language?: string;
  alternate?: Array<ILink>;
  children?: Array<ILink>;
}