import {createContext, useContext, useState} from "react";
import * as api from "../api/api";

const authContext = createContext(null);

function useProvideAuth() {
	const [user, setUser] = useLocalStorage("sealdeal.user", null);
	/**
	 * @param {string} firstName
	 * @param {string} lastName
	 */
	const signin = async (firstName, lastName) => {
		try {
			const user = await api.login(firstName, lastName);
			setUser(user);
		} catch (err) {
			const propagateErr = (err) => {
				console.error(err);
				throw err;
			};

			if (String(err.message).includes("No registered user")) {
				try {
					const user = await api.signin(firstName, lastName);
					setUser(user);
				} catch (err) {
					propagateErr(err);
				}
			} else {
				propagateErr(err);
			}
		}
	};

	const signout = () => {
		localStorage.removeItem("sealdeal.user");
		location.reload();
	};

	const setCachedUser = (user) => {
		localStorage.setItem("sealdeal.user", JSON.stringify(user));
	};

	return {signin, signout, setCachedUser, user};
}

/**
 * @returns {AuthContext.AuthState}
 */
export const useAuth = () => useContext(authContext);

export function ProvideAuth({children}) {
	const auth = useProvideAuth();
	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

/**
 * @param {string} key
 * @param {any} initialValue
 */
function useLocalStorage(key, initialValue) {
	const [storedValue, setStoredValue] = useState(() => {
		try {
			const item = window.localStorage.getItem(key);
			return item ? JSON.parse(item) : initialValue;
		} catch (error) {
			console.log(error);
			return initialValue;
		}
	});

	const setValue = (value) => {
		try {
			const valueToStore = value instanceof Function ? value(storedValue) : value;
			setStoredValue(valueToStore);
			window.localStorage.setItem(key, JSON.stringify(valueToStore));
		} catch (error) {
			console.log(error);
		}
	};

	return [storedValue, setValue];
}
