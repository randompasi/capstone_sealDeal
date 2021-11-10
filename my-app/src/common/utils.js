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
