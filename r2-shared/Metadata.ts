import { IContributor} from "./Contributor";
import { ReadingProgression } from "./ReadingProgression";
import { ISubject } from "./Subject";
import { LocalizedString } from "./LocalizedString";
import { IPresentationMetadata } from "./presentation/Presentation";

interface ICollection extends IContributor {
  position?: number;
}

interface ICollections {
  collection?: string | ICollection;
  series?: string | ICollection;
}

type Contributor = string | IContributor | Array<string | IContributor>;
type Subject = string | ISubject | Array<string | ISubject>;

export interface IMetadata {
  identifier: string;
  title: string | LocalizedString;
  subtitle?: string | LocalizedString;
  artist?: Contributor;
  author?: Contributor;
  colorist?: Contributor;
  contributor?: Contributor;
  editor?: Contributor;
  illustrator?: Contributor;
  inker?: Contributor;
  letterer?: Contributor;
  narrator?: Contributor;
  penciler?: Contributor;
  translator?: Contributor;
  language?: Array<string>;
  description?: string;
  publisher?: Contributor;
  imprint?: Contributor;
  published?: string;
  modified?: string;
  subject?: Subject;
  belongsTo?: ICollections;
  readingProgression?: ReadingProgression;
  duration?: number;
  numberOfPages?: number;
  abridged?: boolean;
  presentation?: IPresentationMetadata;
}