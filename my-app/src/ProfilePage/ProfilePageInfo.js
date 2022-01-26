import useFullUserProfile from "./useFullUserProfile";
import {defaultAvatarImage} from "./helpers";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import {makeCssUrl} from "../common/utils";
import EditableGrid from "../EditableGrid/EditableGrid";
import gridComponents from "./gridComponents";
import {useAuth} from "../auth/authContext";

/**
 * @param {ProfilePage.UserProfileInfoProps} props
 */
export default function ProfilePage({user: userBase, gridStateProps}) {
	const isOwnProfilePage = useAuth().user?.id === userBase.id;
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
	};

	const canEditGrid = isOwnProfilePage && user.premium;

	// In our own profile page there's "empty slot" rows at the top and bottom of the grid
	// which already adds some "padding", so we'll disable extra css padding there.
	const noPaddingClassName = isOwnProfilePage ? "pt-0 pb-0" : "";

	return (
		<div
			id="page-container"
			className="flex flex-col items-center"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className={`w-full sm-w-10/12 xl:w-8/12 p-8 mt-10 mb-10 ${noPaddingClassName}`}
				style={{backgroundColor: "white"}}
			>
				<EditableGrid
					canEdit={canEditGrid}
					user={user}
					components={gridComponents}
					gridStateProps={gridStateProps}
				/>
			</div>
		</div>
	);
}
