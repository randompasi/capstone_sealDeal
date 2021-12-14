import {useRef} from "react";
import {useInput, useResource} from "../utils/hooks";
import * as api from "../api/api";
import Modal from "react-modal";

export default function Search() {
	const usersResource = useResource(async () => {
		const usersMap = await api.fetchAllUsers();
		return Array.from(usersMap.values(), (user) => {
			const searchTerm = `${user.firstName} ${user.lastName}`.toLowerCase();
			return {searchTerm, user};
		});
	});
	const searchState = useInput("");
	/** @type{React.MutableRefObject<HTMLInputElement>} */
	const searchRef = useRef();
	const isOpen = searchState.value.length > 0;

	const filteredUsers =
		usersResource.status === "success" && isOpen
			? usersResource.value.filter((user) =>
					user.searchTerm.includes(searchState.value.toLowerCase())
			  )
			: [];

	return (
		<div>
			<input
				ref={searchRef}
				className="rounded border-gray-300 border bg-transparent p-2"
				type="search"
				{...searchState}
				placeholder="Search user"
			/>
			{searchRef.current && (
				<Modal
					isOpen={isOpen}
					ariaHideApp
					style={{
						overlay: {
							position: "absolute",
							top: searchRef.current.offsetTop + searchRef.current.offsetHeight,
							left: searchRef.current.offsetLeft,
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
									<a href={`/user-profile/${user.id}`}>
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
