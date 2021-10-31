import facepng from "../assets/face.jpg";
import {useState} from "react";
import BasicInfo from "./BasicInfo";
import Achievements from "./Achievements";
import Reviews from "./Reviews";
import SellingHistory from "./SellingHistory";
import EnvironmentalSavings from "./EnvironmentalSavings";

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
		<div className="flex flex-col items-center">
			<div className="w-9/12">
				<BasicInfo user={user} />
				<Achievements user={user} />
				<Reviews user={user} />
				<SellingHistory user={user} />
				<EnvironmentalSavings user={user} />
			</div>
		</div>
	);
}
