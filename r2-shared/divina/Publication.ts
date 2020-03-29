import { IPublication } from "../Publication";
import { ILink } from "../Link";

export interface IDivinaPublication extends IPublication {
  guided?: Array<ILink>;
}