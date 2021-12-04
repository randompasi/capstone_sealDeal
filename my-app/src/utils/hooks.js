import {useEffect, useState} from "react";

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
 * @type {UtilityTypes.UseResource}
 */
export function useResource(fetchData) {
	/** @type{any} */
	const [state, setState] = useState({status: "loading"});
	useEffect(() => {
		fetchData().then(
			(value) => setState({status: "success", value}),
			(error) => setState({status: "error", error})
		);
	}, []);
	return state;
}
