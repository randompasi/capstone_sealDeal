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
			<div className="w-8/12  p-8 pt-4 mt-8 grid grid-cols-2 gap-x-8"  style={{backgroundColor: "white"}}>
				<div className="col-span-2">
					<BasicInfo user={user} />
				</div>

				<div className="col-span-2">
					<Achievements user={user} />
				</div>
				
				<Reviews user={user} />

				<SellingHistory user={user} />
				
				<div className="col-span-2">
					<EnvironmentalSavings user={user} />
				</div>
			</div>
		</div>
	);
}
