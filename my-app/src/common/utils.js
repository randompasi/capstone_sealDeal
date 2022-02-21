/**
 * Creates a list of items by running iteratee
 * n times.
 * @type {UtilityTypes.TimesUtilityFunction}
 */
export const times = (n, iteratee) => {
	const result = [];
	for (let i = 0; i < n; i++) {
		result.push(iteratee(i));
	}
	return result;
};

export const loadImageToBase64 = (imageUrl) =>
	new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.onload = function () {
			const reader = new FileReader();
			reader.onloadend = function () {
				resolve(reader.result);
			};
			reader.readAsDataURL(xhr.response);
		};
		xhr.open("GET", imageUrl);
		xhr.responseType = "blob";
		xhr.send();
	});

/**
 * @param {string} url
 * @returns {string}
 */
export const makeCssUrl = (url) => `url(${JSON.stringify(url)})`;

/**
 * @param {never} _impossibleValue
 * @returns {null}
 */
// eslint-disable-next-line no-unused-vars
export function impossibleCase(_impossibleValue) {
	return null;
}

/**
 * @type {UtilityTypes.IdentityFunction}
 */
export const cloneDeepJson = (value) => {
	return JSON.parse(JSON.stringify(value));
};

/**
 * Object.keys, but with better type definition so that enum-typed keys
 * remain as enum types, not string[].
 *
 * @type {UtilityTypes.ObjectKeysFn}
 */
export const objectKeys = (obj) => {
	// @ts-ignore
	return Object.keys(obj);
};

/**
 * @param {(string | undefined | null | false)[]} classNames
 * @returns {string}
 */
export function combineClassnames(...classNames) {
	return classNames.filter((_) => typeof _ === "string" && !!_).join(" ");
}

/**
 * @param {{firstName: string, lastName: string}} user
 * @returns {string}
 */
export function fullName(user) {
	return `${user.firstName} ${user.lastName}`;
}
