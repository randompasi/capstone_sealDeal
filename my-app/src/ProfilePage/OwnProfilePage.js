import {useAuth} from "../auth/authContext";
import {useState} from "react";
import {loadImageToBase64} from "../common/utils";
import {useAsyncEffect} from "../utils/hooks";
import {patchUser} from "../api/api";
import ProfilePageInfo from "./ProfilePageInfo";
import PremiumModal from "./PremiumModal";
import SettingsModal from "./SettingsModal";

export default function ProfilePage({controlPremiumModal, controlSettingsModal}) {
	const authContext = useAuth();
	const loggedInUser = authContext.user;

	const [profileImage, setProfileImage] = useState(null);
	const [backgroundImage, setBackgroundImage] = useState(null);

	//Update state changes to DB on SettingsModal call
	useAsyncEffect(async () => {
		if (!profileImage) return;
		const base64 = await loadImageToBase64(profileImage);
		await patchUser(authContext, {
			avatarBase64: base64,
		});
	}, [profileImage]);

	useAsyncEffect(async () => {
		if (!backgroundImage) return;
		const base64 = await loadImageToBase64(backgroundImage);
		await patchUser(authContext, {
			backgroundBase64: base64,
		});
	}, [backgroundImage]);

	if (!loggedInUser?.id) {
		return null; // TODO: Loading spinner / error handling
	}

	const user = {
		...loggedInUser,
		avatarBase64: profileImage,
		backgroundBase64: backgroundImage,
	};

	return (
		<div>
			<ProfilePageInfo user={user} />
			<PremiumModal control={controlPremiumModal} />
			<SettingsModal
				user={user}
				control={controlSettingsModal}
				setBackgroundImage={setBackgroundImage}
				setProfileImage={setProfileImage}
			/>
		</div>
	);
}
