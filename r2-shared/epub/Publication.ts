import Publication from "../Publication";
import { Link } from "../Link";
import { Layout } from "./Layout";

export default class EPUBPublication extends Publication {
  public readonly pageList?: Array<Link>;
  public readonly landmarks?: Array<Link>;
  public readonly listOfAudioClips?: Array<Link>;
  public readonly listOfIllustrations?: Array<Link>;
  public readonly listOfTables?: Array<Link>;
  public readonly listOfVideoClips?: Array<Link>;

  constructor(manifestJSON: any, manifestURL?: string) {
    super(
      manifestJSON,
      manifestURL
    )
    this.pageList = manifestJSON.pageList || [];
    this.landmarks = manifestJSON.landmarks || [];
    this.listOfAudioClips = manifestJSON.loa || [];
    this.listOfIllustrations = manifestJSON.loi || [];
    this.listOfTables = manifestJSON.lot || [];
    this.listOfVideoClips = manifestJSON.lov || [];
  }

  public layoutOf(link: Link): Layout {
    if (link.properties && link.properties.layout) {
      return link.properties.layout;
    } else if (this.metadata && this.metadata.presentation && this.metadata.presentation.layout) {
      return this.metadata.presentation.layout;
    } else {
      return "reflowable";
    }
  }
}