/**
 * Read a boolean flag from a DOM data-attribute written by server layout.
 * Example: <body data-flag-new-navigation="1" /> → readFlagFromDOM('data-flag-new-navigation')
 */
export function readFlagFromDOM(attributeName: string): boolean {
	if (typeof document === "undefined") return false;
	return document.body.getAttribute(attributeName) === "1";
}
