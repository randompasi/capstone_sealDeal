import {useState} from "react";
import BasicInfo from "./BasicInfo";

export default function ProfilePage() {
	const [user] = useState(() => {
		/** @type {import('./types').UserInfo} */
		const user = {
			avatarUrl: "test",
			name: "Foo Bar",
		};
		return user;
	});
	const [counter, setCount] = useState(() => 0);
	return (
		<div>
			<button
				onClick={() => {
					setCount(counter + 1);
				}}
			>
				Add
			</button>
			<div>{counter}</div>
			<BasicInfo user={user} />
		</div>
	);
}
