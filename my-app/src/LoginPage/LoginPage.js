import {fetchAllUsers, getUserByName} from "../api/api";
import {useAuth} from "../auth/authContext";
import {useInput, useResource} from "../utils/hooks";

/**
 * @type {React.FunctionComponent<{firstName: string, lastName: string}>}
 */
function LoginOrSignupMessage({firstName, lastName}) {
	/** @type {UtilityTypes.AsyncResourceState<Map<string, any>>} */
	const usersFetchState = useResource(() => fetchAllUsers());
	if (
		usersFetchState.status !== "success" ||
		!getUserByName(usersFetchState.value, firstName, lastName)
	) {
		return <span>Sign up</span>;
	}
	return <span>Login</span>;
}

export default function LoginPage() {
	const firstNameInput = useInput("");
	const lastNameInput = useInput("");
	const {signin} = useAuth();

	const onSignup = async (evt) => {
		evt.preventDefault();
		await signin(firstNameInput.value, lastNameInput.value);
	};

	return (
		<div className="w-full h-96 flex justify-center items-center">
			<form className="max-w-md p-10 border-2 rounded-lg border-purple-500" onSubmit={onSignup}>
				<div className="flex flex-wrap -mx-3 mb-6">
					<div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
						<label
							className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
							htmlFor="grid-first-name"
						>
							First Name
						</label>
						<input
							className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
				<div className="w-100 flex items-center justify-center">
					<button
						className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
						type="submit"
						disabled={!firstNameInput.value || !lastNameInput.value}
					>
						<LoginOrSignupMessage firstName={firstNameInput.value} lastName={lastNameInput.value} />
					</button>
				</div>
			</form>
		</div>
	);
}
