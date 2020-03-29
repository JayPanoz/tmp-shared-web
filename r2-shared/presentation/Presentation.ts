import { Layout } from "../epub/Layout";

export type Orientation = "auto" | "landscape" | "portrait";
export type Overflow = "auto" | "clipped" | "paginated" | "scrolled";
export type Page = "left" | "right" | "center";
export type Spread = "auto" | "both" | "none" | "landscape";
export type Fit = "contain" | "cover" | "width" | "height";

interface IPresentation {
  clipped?: boolean;
  fit?: Fit;
  orientation?: Orientation;
  spread?: Spread;
  layout?: Layout;
}

export interface IPresentationMetadata extends IPresentation {
  continuous?: boolean;
  overflow?: Overflow;
}

export interface IPresentationProperty extends IPresentation {
  page?: Page;
}