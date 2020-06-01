import { IContributor} from "./Contributor";
import { ReadingProgression } from "./ReadingProgression";
import { ISubject } from "./Subject";
import { LocalizedString } from "./LocalizedString";
import { PresentationMetadata } from "./presentation/Presentation";

interface Collection extends IContributor {
  position?: number;
}

interface Collections {
  collection?: string | Collection;
  series?: string | Collection;
}

type Contributor = string | IContributor | Array<string | IContributor>;
type Subject = string | ISubject | Array<string | ISubject>;

export interface Metadata {
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
  belongsTo?: Collections;
  readingProgression?: ReadingProgression;
  duration?: number;
  numberOfPages?: number;
  abridged?: boolean;
  presentation?: PresentationMetadata;
}