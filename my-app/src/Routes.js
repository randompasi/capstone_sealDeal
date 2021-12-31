import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import OwnProfilePage from "./ProfilePage/OwnProfilePage";
import ViewUserProfile from "./ProfilePage/ViewUserProfile";

export default function SealdealRoutes({
	settings,
	setSettings,
	showPremiumModal,
	setPremiumModal,
	setBackgroundImage,
}) {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
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
							setBackgroundImage={setBackgroundImage}
						/>
					}
				/>
				<Route path="/user-profile/:id" element={<ViewUserProfile />} />
			</Routes>
		</Router>
	);
}
