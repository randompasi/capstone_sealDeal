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
