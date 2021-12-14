import defaultProfile from "../assets/ProfileImages/bird1.jpg";
import BasicInfo from "./BasicInfo";
import Achievements from "./Achievements";
import Reviews from "./Reviews";
import SellingHistory from "./SellingHistory";
import EnvironmentalSavings from "./EnvironmentalSavings";
import {useResource} from "../utils/hooks";
import {fetchAllUsers} from "../api/api";
import {useParams} from "react-router-dom";

export default function ViewUserProfile() {
	const params = useParams();
	const userId = Number(params.id);
	const userResource = useResource(async () => {
		const usersMap = await fetchAllUsers();
		const user = Array.from(usersMap.values()).find((user) => user.id === userId);
		return user;
	});
	if (userResource.status !== "success") {
		return null;
	}
	const fetchedUser = userResource.value;
	if (!fetchedUser) {
		return <div>Ei käyttäjää id:llä {userId}</div>;
	}

	/** @type {ProfilePage.UserInfo} */
	const user = {
		id: fetchedUser.id,
		avatarUrl: fetchedUser.avatarBase64 ?? defaultProfile, //Fallback: state -> database -> hardcoded default
		name: `${fetchedUser.firstName} ${fetchedUser.lastName}`,
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
