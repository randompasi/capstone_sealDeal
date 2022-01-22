import {useAuth} from "../auth/authContext";
import {makeCssUrl} from "../common/utils";
import useFullUserProfile from "../ProfilePage/useFullUserProfile";

export default function OffersView() {
	const authContext = useAuth();
	const fetchedProfile = useFullUserProfile(authContext.user.id);
	if (fetchedProfile.status !== "success") {
		return null;
	}
	const loggedInUser = fetchedProfile.value;
	const parsedBgUrl = makeCssUrl(loggedInUser.backgroundBase64);
	return (
		<div
			id="offers-page-container"
			className="flex flex-col items-center h-screen w-screen"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full sm:w-10/12 xl:w-5/12 p-8 pt-4 mt-8 grid grid-cols-2 gap-x-8 mb-8 h-full"
				style={{backgroundColor: "white"}}
			>
				<h1 className="text-black">Offer page WIP</h1>
			</div>
		</div>
	);
}
