import {useAuth} from "../auth/authContext";
import {useRef, useState} from "react";
import {loadImageToBase64} from "../common/utils";
import {useAsyncEffect} from "../utils/hooks";
import {patchUser, upsert} from "../api/api";
import ProfilePageInfo from "./ProfilePageInfo";
import PremiumModal from "./PremiumModal";
import SettingsModal from "./SettingsModal";
import gridComponents from "./gridComponents";
import {DndProvider} from "react-dnd";
import {HTML5Backend as DnDHTML5Backend} from "react-dnd-html5-backend";
import {
	isEmptyRow,
	isEmptySlot,
	makeRowMapper,
	useProfileGridResource,
} from "../EditableGrid/editableGridUtils";

export default function OwnProfilePage({controlPremiumModal, controlSettingsModal}) {
	const authContext = useAuth();
	const loggedInUser = authContext.user;
	const gridResource = useProfileGridResource(loggedInUser.profileGridId);

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

	// Used for skipping saving the user on the first call to useAsyncEffect,
	// only saving when the grid state actually changes.
	const ignoreFirstGridState = useRef(true);
	useAsyncEffect(async () => {
		const value = gridResource.status === "success" ? gridResource.value : null;
		if (!value) {
			return;
		}
		if (ignoreFirstGridState.current) {
			// Skip the first update, we get here just because the item was loaded.
			// We only want to run updates when something changes.
			ignoreFirstGridState.current = false;
			return;
		}

		// Save the user's grid to db
		const {profileGridId} = loggedInUser;

		// When we save the grid to DB, persist empty slots as nulls
		const payload = value.gridState.gridState
			.filter((_) => !isEmptyRow(_))
			.map(makeRowMapper((_) => (isEmptySlot(_) ? null : _)));

		const [savedGrid] = await upsert("profileGrids", {
			id: profileGridId,
			rows: payload,
		});
		if (!profileGridId) {
			await patchUser(authContext, {
				profileGridId: savedGrid.id,
			});
		}
	}, [gridResource.status, gridResource.status === "success" ? gridResource.value : null]);

	if (!loggedInUser?.id || gridResource.status !== "success") {
		return null; // TODO: Loading spinner / error handling
	}
	const gridStateProps = gridResource.value.gridState;

	const user = {
		...loggedInUser,
		avatarBase64: profileImage,
		backgroundBase64: backgroundImage,
	};

	return (
		<div className="w-full">
			<DndProvider backend={DnDHTML5Backend}>
				<ProfilePageInfo user={user} gridStateProps={gridStateProps} />
				<PremiumModal control={controlPremiumModal} />
				<SettingsModal
					user={user}
					control={controlSettingsModal}
					setBackgroundImage={setBackgroundImage}
					setProfileImage={setProfileImage}
					gridStateProps={gridStateProps}
					gridComponents={gridComponents}
				/>
			</DndProvider>
		</div>
	);
}
