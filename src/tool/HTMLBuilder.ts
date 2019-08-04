export class HTMLBuilder {
  static createHTMLElement(
    type: string,
    id: string,
    className: string,
    innerHTML: string
  ) {
    return `<${type} class="${className}" id="${id}">${innerHTML}</${type}>`;
  }
}
