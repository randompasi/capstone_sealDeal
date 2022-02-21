export const WHITE = "#FFFFFF";
export const RED = "#FE9996";
export const GREEN = "#96fea4";
export const BLUE = "#96cffe";
export const YELLOW = "#feeb96";
export const GRAY = "#c5c5c5";

/**
 * @param {string} hex
 * @param {number} alpha
 */
export function hexToRgba(hex, alpha) {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return `rgba(${result
		.slice(1, 4)
		.map((_) => parseInt(_, 16))
		.join(", ")}, ${alpha})`;
}
