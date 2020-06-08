import PublicationManifest from "../PublicationManifest";
import { Links } from "../Link";

export default class DivinaPublicationManifest extends PublicationManifest {
  public readonly guided?: Links;

  constructor(manifestJSON: any, manifestURL?: string) {
    super(
      manifestJSON,
      manifestURL
    )
    this.guided = manifestJSON.guided ? new Links(manifestJSON.guided) : new Links([]);
  }
}