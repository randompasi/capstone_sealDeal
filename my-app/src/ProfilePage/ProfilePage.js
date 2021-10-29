import facepng from "../assets/face.png";
import {useState} from "react";
import BasicInfo from "./BasicInfo";

export default function ProfilePage() {
	const [user] = useState(() => {
		/** @type {import('./types').UserInfo} */
		const user = {
			avatarUrl: facepng,
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
