import { EPUBLayout } from "../epub/Layout";

export type Orientation = "auto" | "landscape" | "portrait";
export type Overflow = "auto" | "clipped" | "paginated" | "scrolled";
export type Page = "left" | "right" | "center";
export type Spread = "auto" | "both" | "none" | "landscape";
export type Fit = "contain" | "cover" | "width" | "height";

interface Presentation {
  clipped?: boolean;
  fit?: Fit;
  orientation?: Orientation;
  spread?: Spread;
  layout?: EPUBLayout;
}

export interface PresentationMetadata extends Presentation {
  continuous?: boolean;
  overflow?: Overflow;
}

export interface PresentationProperties extends Presentation {
  page?: Page;
}