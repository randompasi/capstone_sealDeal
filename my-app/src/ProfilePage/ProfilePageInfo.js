import BasicInfo from "./BasicInfo";
import Achievements from "./Achievements";
import Reviews from "./Reviews";
import SellingHistory from "./SellingHistory";
import EnvironmentalSavings from "./EnvironmentalSavings";
import useFullUserProfile from "./useFullUserProfile";
import {defaultAvatarImage} from "./helpers";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import {makeCssUrl} from "../common/utils";

/**
 * @param {ProfilePage.UserProfileInfoProps} props
 */
export default function ProfilePage({user: userBase}) {
	const fullProfileResource = useFullUserProfile(userBase.id);

	if (fullProfileResource.status !== "success") {
		return null; // TODO: Loading spinner / error handling
	}
	const fullProfile = fullProfileResource.value;

	if (!fullProfile) {
		return <div>Ei käyttäjää id:llä {userBase.id}</div>;
	}

	//Dumb fix for handling none local profile viewing
	const isPremium = userBase.premium ?? fullProfile.premium;
	let parsedAvatarUrl;
	let parsedBgUrl;
	if (!isPremium) {
		//Simple API that generates Avatars based on names, https://eu.ui-avatars.com/
		//Only requesting with innitials to be extra safe with privacy :P
		parsedAvatarUrl =
			"https://eu.ui-avatars.com/api/?name=" +
			fullProfile.firstName.charAt(0) +
			"+" +
			fullProfile.lastName.charAt(0);

		//Force none reactive default bg for none premium users
		parsedBgUrl = makeCssUrl(defaultBackground);
	} else {
		parsedAvatarUrl = userBase.avatarBase64 ?? fullProfile.avatarBase64 ?? defaultAvatarImage;

		parsedBgUrl = makeCssUrl(
			userBase.backgroundBase64 ?? fullProfile.backgroundBase64 ?? defaultBackground
		);
	}

	/** @type {ProfilePage.UserInfo} */
	const user = {
		id: fullProfile.id,
		avatarUrl: parsedAvatarUrl,
		name: `${fullProfile.firstName} ${fullProfile.lastName}`,
		bday: "22.10.1987",
		city: "Turku",
		followers: fullProfile.followers,
		premium: isPremium,
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
		<div
			id="page-container"
			className="flex flex-col items-center"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full sm:w-10/12 xl:w-5/12 p-8 pt-4 mt-8 grid grid-cols-2 gap-x-8 mb-8"
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
