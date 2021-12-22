import {useAuth} from "../auth/authContext";
import {useState} from "react";
import {loadImageToBase64} from "../common/utils";
import {useAsyncEffect} from "../utils/hooks";
import {patchUser} from "../api/api";
import ProfilePageInfo from "./ProfilePageInfo";

export default function ProfilePage(settingsProps) {
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

	if (!loggedInUser?.id) {
		return null; // TODO: Loading spinner / error handling
	}

	const user = {
		...loggedInUser,
		avatarImageBase64: profileImage,
	};

	return <ProfilePageInfo user={user} settingsProps={{...settingsProps, setProfileImage}} />;
}
