import useFullUserProfile from "./useFullUserProfile";
import {defaultAvatarImage} from "./helpers";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import {makeCssUrl} from "../common/utils";
import EditableGrid from "../EditableGrid/EditableGrid";
import gridComponents from "./gridComponents";
import {useAuth} from "../auth/authContext";
import SealMascot from "./SealMascot/SealMascot";

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
	let bgUrl;
	if (!isPremium) {
		//Simple API that generates Avatars based on names, https://eu.ui-avatars.com/
		//Only requesting with innitials to be extra safe with privacy :P
		parsedAvatarUrl =
			"https://eu.ui-avatars.com/api/?name=" +
			fullProfile.firstName.charAt(0) +
			"+" +
			fullProfile.lastName.charAt(0);

		//Force none reactive default bg for none premium users
		bgUrl = defaultBackground;
	} else {
		parsedAvatarUrl = userBase.avatarBase64 ?? fullProfile.avatarBase64 ?? defaultAvatarImage;

		bgUrl = userBase.backgroundBase64 ?? fullProfile.backgroundBase64 ?? defaultBackground;
	}
	const parsedBgUrl = makeCssUrl(bgUrl);

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

	const wrapperClassName = `w-full sm-w-10/12 xl:w-8/12`;

	return (
		<div id="page-container" className="h-full min-h-screen pt-10">
			<div
				className="flex flex-col h-screen w-screen fixed top-0 left-0 z-0 pointer-events-none"
				style={{
					backgroundImage: parsedBgUrl,
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			></div>
			<div className="relative w-full m-auto flex flex-col items-center">
				<div
					className={wrapperClassName + ` absolute h-full w-full top-0`}
					style={{clip: "rect(0, auto, auto, 0)"}}
				>
					<img
						src={bgUrl}
						className="w-screen h-screen fixed top-0 left-0 object-cover object-center z-0 pointer-events-none"
						style={{
							opacity: 0.9,
							filter: "brightness(1.5) blur(4px)",
						}}
					/>
				</div>
				<div className={wrapperClassName + ` p-2 sm:p-8 pt-0 pb-0 z-10`}>
					<div>
						<div>
							<SealMascot />
						</div>
						<EditableGrid
							canEdit={canEditGrid}
							user={user}
							components={gridComponents}
							gridStateProps={gridStateProps}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
