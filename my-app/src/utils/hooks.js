import {useCallback, useEffect, useState} from "react";

/**
 * @param {string} initialValue
 * @returns {{value: string, onChange: (evt: any) => void}}
 */
export function useInput(initialValue) {
	const [value, setValue] = useState(initialValue);

	function handleChange(e) {
		setValue(e.target.value);
	}

	return {
		value,
		onChange: handleChange,
	};
}

/**
 * @param {boolean} val
 */
function toggleBoolean(val) {
	return !val;
}

/**
 * @param {boolean} [initialValue] Default: false
 */
export function useToggle(initialValue) {
	const [isOpen, setValue] = useState(Boolean(initialValue));
	const toggle = useCallback(() => {
		setValue(toggleBoolean);
	}, []);
	return {isOpen, toggle};
}

/**
 * @type {UtilityTypes.UseResource}
 */
export function useResource(fetchData, dependencies = []) {
	/** @type{any} */
	const [state, setState] = useState({status: "loading"});
	useEffect(() => {
		fetchData().then(
			(value) => setState({status: "success", value}),
			(error) => setState({status: "error", error})
		);
	}, dependencies);
	return state;
}

export const useAsyncEffect = (fn, deps) =>
	useEffect(() => {
		fn();
	}, deps);
