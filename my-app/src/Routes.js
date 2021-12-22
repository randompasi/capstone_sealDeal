import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import OwnProfilePage from "./ProfilePage/OwnProfilePage";
import ViewUserProfile from "./ProfilePage/ViewUserProfile";

export default function SealdealRoutes({settings, setSettings, setBackgroundImage}) {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<OwnProfilePage
							setSettings={setSettings}
							settings={settings}
							setBackgroundImage={setBackgroundImage}
						/>
					}
				/>
				<Route path="/user-profile/:id" element={<ViewUserProfile />} />
			</Routes>
		</Router>
	);
}
