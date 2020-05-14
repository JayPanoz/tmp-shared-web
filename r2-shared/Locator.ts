interface IText {
  after?: string;
  before?: string;
  highlight?: string;
}

interface IStartEnd {
  cssSelector: string;
  textNodeIndex: number;
  charOffset?: number;
}

interface IDomRange {
  start: IStartEnd;
  end?: IStartEnd;
}

interface ILocations {
  fragments?: Array<string>;
  progression?: number;
  position?: number;
  totalProgression?: number;
  cssSelector?: string;
  partialCfi?: string;
  domRange?: IDomRange;
}

export interface ILocator {
  href: string;
  type: string;
  title?: string;
  locations?: ILocations;
  text?: IText;
}