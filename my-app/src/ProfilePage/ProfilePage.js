import defaultProfile from "../assets/ProfileImages/bird1.jpg";
import BasicInfo from "./BasicInfo";
import Achievements from "./Achievements";
import Reviews from "./Reviews";
import SellingHistory from "./SellingHistory";
import SettingsModal from "./SettingsModal";
import EnvironmentalSavings from "./EnvironmentalSavings";
import {useAuth} from "../auth/authContext";
import {useState} from "react";
import {loadImageToBase64} from "../common/utils";
import {useAsyncEffect} from "../utils/hooks";
import {patchUser} from "../api/api";

export default function ProfilePage({settings, setSettings, setBackgroundImage}) {
	const authContext = useAuth();
	const loggedInUser = authContext.user;

	const [profileImage, setProfileImage] = useState(null);

	//Update state change to DB on SettingsModal call
	useAsyncEffect(async () => {
		if (!profileImage) return;
		const base64 = await loadImageToBase64(profileImage);
		await patchUser(authContext, {
			avatarBase64: base64,
		});
	}, [profileImage]);

	/** @type {ProfilePage.UserInfo} */
	const user = {
		id: loggedInUser.id,
		avatarUrl: profileImage ?? loggedInUser.avatarBase64 ?? defaultProfile, //Fallback: state -> database -> hardcoded default
		name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
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

			<SettingsModal
				settings={settings}
				setSettings={setSettings}
				setBackgroundImage={setBackgroundImage}
				setProfileImage={setProfileImage}
			></SettingsModal>
		</div>
	);
}
