import facepng from "../assets/face.jpg";
import {useState} from "react";
import BasicInfo from "./BasicInfo";

export default function ProfilePage() {
	const [user] = useState(() => {
		/** @type {ProfilePage.UserInfo} */
		const user = {
			avatarUrl: facepng,
			name: "Foo Bar",
		};
		return user;
	});
	return (
		<div>
			<BasicInfo user={user} />
		</div>
	);
}
