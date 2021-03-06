import { LocalizedString } from "./LocalizedString";

export interface ISubject {
  name: string | LocalizedString;
  sortAs?: string;
  code?: string;
  scheme?: string;
}