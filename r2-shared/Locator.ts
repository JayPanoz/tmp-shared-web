interface IText {
  after?: string;
  before?: string;
  highlight?: string;
}

interface ILocations {
  fragments?: Array<string>;
  progression?: number;
  position?: number;
  totalProgression?: number;
}

export interface ILocator {
  href: string;
  type: string;
  title?: string;
  locations?: ILocations;
  text?: IText;
}