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
			name: "Tiina Turkulainen",
			bday: "22.10.1987",
			city: "Turku",
			achievements: [
				//Note: The description could eventually be hardcoded to the icon type
				//Doesn't make sense currently since we only have two icons
				{
					text: "Seller No. 1",
					description: "This trophy was awarded to the number 1 seller of the month!",
					iconType: "trophy",
				},
				{
					text: "Top 100",
					description: "This trophy was awarded to the top 100 sellers this month!",
					iconType: "trophy",
				},
				{
					text: "Seal Approved",
					description: "This seller is recognized as trustworthy by the Seal Team!",
					iconType: "trophy",
				},
				{
					text: "Trusted",
					description: "This seller has made +20 completed sales!",
					iconType: "trophy",
				},
				{
					text: "Ecological",
					description: "This seller has saved +20 products from the trashcan!",
					iconType: "trophy",
				},
			],
			reviews: [
				{title: "Item condition", rating: 4},
				{title: "Delivery", rating: 3},
				{title: "Friendliness", rating: 5},
			],
		};
		return user;
	});

	return (
		<div className="flex flex-col items-center">
			<div
				className="w-5/12  p-8 pt-4 mt-8 grid grid-cols-2 gap-x-8"
				style={{backgroundColor: "white"}}
			>
				<div className="col-span-2">
					<BasicInfo user={user} />
				</div>

				<div className="col-span-2">
					<Achievements user={user} />
				</div>

				<Reviews user={user} />

				<SellingHistory />

				<div className="col-span-2">
					<EnvironmentalSavings user={user} />
				</div>
			</div>
		</div>
	);
}
