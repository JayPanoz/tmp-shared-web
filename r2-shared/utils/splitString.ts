export const splitString = (string: string, separator: string): string => {
  if (typeof string === "string") {
    const components = string.split(separator);
    return components[0];
  }
}