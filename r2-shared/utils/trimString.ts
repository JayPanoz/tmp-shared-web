export const trimString = (string: string, separator: string): string => {
  if (typeof string === "string") {
    const components = string.split(separator);
    return components[0];
  }
  return "";
}