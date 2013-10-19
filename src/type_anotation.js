/**
 * @typedef {HTMLHeadElement}
 */
document.head;

/**
 * @typedef {{
 *  id: string,
 *  pos: {x: number, y:number},
 *  sizePolicy: "fixed" | "wrapContent",
 *  size: {width: number, height: number},
 *  backgroundColor: string
 * }}
 */
ViewLayout;

/**
 * @typedef {ViewLayout | {
 *  extra: {
 *    text: string,
 *    fontSize: number
 *  }
 * }}
 */
TextLayout;

/**
 * @typedef {ViewLayout | {
 *  extra: {
 *    src: string
 *  }
 * }}
 */
ImageLayout;

/**
 * @typedef {ViewLayout | {
 *  extra: {
 *    contentLayoutFile: string
 *  }
 * }}
 */
ViewGroupLayout;
