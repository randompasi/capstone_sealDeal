import {Routes, Route} from "react-router-dom";
import OffersView from "./OffersPage/OffersView";
import OwnProfilePage from "./ProfilePage/OwnProfilePage";
import ViewUserProfile from "./ProfilePage/ViewUserProfile";

export default function SealdealRoutes({settings, setSettings, showPremiumModal, setPremiumModal}) {
	return (
		<Routes>
			<Route
				path="/dashboard/"
				element={
					<OwnProfilePage
						controlPremiumModal={{
							showPremiumModal: showPremiumModal,
							setPremiumModal: setPremiumModal,
						}}
						controlSettingsModal={{
							showSettingsModal: settings,
							setSettingsModal: setSettings,
						}}
					/>
				}
			/>
			<Route path="/user-profile/:id" element={<ViewUserProfile />} />
			<Route path="/" element={<OffersView />} />
			<Route path="/offer-to/:id" element={<OffersView />} />
		</Routes>
	);
}
