import {fetchAllUsers, getUserByName} from "../api/api";
import {useAuth} from "../auth/authContext";
import {useInput, useResource} from "../utils/hooks";

/**
 * @type {React.FunctionComponent<{firstName: string, lastName: string}>}
 */
function LoginOrSignupMessage({firstName, lastName}) {
	/** @type {UtilityTypes.AsyncResourceState<Map<string, any>>} */
	const usersFetchState = useResource(() => fetchAllUsers());
	console.log(usersFetchState);
	if (usersFetchState.status !== "success") return null;

	const user = getUserByName(usersFetchState.value, firstName, lastName);
	console.log(user, firstName, lastName);
	return <span>{user ? "Login" : "Sign up"}</span>;
}

export default function LoginPage() {
	const firstNameInput = useInput("");
	const lastNameInput = useInput("");
	const {signin} = useAuth();

	const onSignup = async () => {
		await signin(firstNameInput.value, lastNameInput.value);
	};
	console.log(firstNameInput.value, lastNameInput.value);

	return (
		<div className="w-full content-center">
			<form className="max-w-md">
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							htmlFor="grid-first-name"
						>
							First Name
						</label>
						<input
							className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
							id="grid-first-name"
							type="text"
							placeholder="Matti"
							{...firstNameInput}
						/>
					</div>
					<div className="w-full md:w-1/2 px-3">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							htmlFor="grid-last-name"
						>
							Last Name
						</label>
						<input
							className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
							id="grid-last-name"
							type="text"
							placeholder="Meikäläinen"
							{...lastNameInput}
						/>
					</div>
				</div>
				<div className="md:flex md:items-center">
					<div className="md:w-1/3"></div>
					<div className="md:w-2/3">
						<button
							className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							type="button"
							onClick={onSignup}
							disabled={!firstNameInput.value || !lastNameInput.value}
						>
							<LoginOrSignupMessage
								firstName={firstNameInput.value}
								lastName={lastNameInput.value}
							/>
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
