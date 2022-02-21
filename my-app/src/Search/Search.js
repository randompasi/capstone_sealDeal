import {useCallback, useEffect, useRef, useState} from "react";
import {useInput, useResource} from "../utils/hooks";
import * as api from "../api/api";
import Modal from "react-modal";
import debounce from "lodash/debounce";

function DebouncedInput({onChange, forwardedRef, bgColor}) {
	const inputState = useInput("");
	const changeCallback = useCallback(
		debounce((...args) => onChange(...args), 300),
		[onChange]
	);
	useEffect(() => {
		changeCallback(inputState.value);
	}, [inputState, changeCallback]);
	return (
		<input
			className={"rounded border-gray-300 border p-2 " + "bg-" + bgColor}
			type="search"
			placeholder="Search user"
			{...inputState}
			ref={forwardedRef}
		/>
	);
}

/**
 * @param {ProfilePage.SearchComponentProps} props
 */
export default function Search({onClick, position, inputColor}) {
	const usersResource = useResource(async () => {
		const usersMap = await api.fetchAllUsers();
		return Array.from(usersMap.values(), (user) => {
			const searchTerm = `${user.firstName} ${user.lastName}`.toLowerCase();
			return {searchTerm, user};
		});
	});
	const [searchValue, setSearch] = useState("");
	/** @type{React.MutableRefObject<HTMLInputElement>} */
	const searchRef = useRef();
	const isOpen = searchValue.length > 0;

	const filteredUsers =
		usersResource.status === "success" && isOpen
			? usersResource.value.filter((user) => user.searchTerm.includes(searchValue.toLowerCase()))
			: [];

	//Quick fix to reuse the component by overriding search links if an onClick function is given
	//The search passes the selected user as a default param for the onClick function
	let overrideLink = false;
	if (typeof onClick !== "undefined" && onClick !== null) {
		overrideLink = true;
	}

	let overrideX,
		overrideY = null;
	if (position) {
		overrideX = position.x;
		overrideY = position.y;
	}

	let overrideInputColor = "transparent";
	if (inputColor) {
		overrideInputColor = inputColor;
	}

	return (
		<div>
			<DebouncedInput forwardedRef={searchRef} onChange={setSearch} bgColor={overrideInputColor} />
			{searchRef.current && (
				<Modal
					isOpen={isOpen}
					ariaHideApp={false}
					style={{
						overlay: {
							position: "absolute",
							top: overrideY ?? searchRef.current.offsetTop + searchRef.current.offsetHeight,
							left: overrideX ?? searchRef.current.offsetLeft,
							maxWidth: 400,
							height: 300,
							backgroundColor: "rgba(255, 255, 255, 0.9)",
						},
						content: {
							inset: 5,
							border: 0,
							background: "transparent",
						},
					}}
				>
					{isOpen && (
						<ul className="divide-y-2 divide-gray-100">
							{filteredUsers.map(({user}) => (
								<li key={user.id} className="p-3">
									<a
										href={overrideLink ? "#" : `/user-profile/${user.id}`}
										onClick={
											overrideLink
												? () => {
														onClick(user);
												  }
												: null
										}
									>
										{user.firstName} {user.lastName}
									</a>
								</li>
							))}
						</ul>
					)}
				</Modal>
			)}
		</div>
	);
}
