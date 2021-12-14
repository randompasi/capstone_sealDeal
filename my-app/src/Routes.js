import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProfilePage from "./ProfilePage/ProfilePage";
import ViewUserProfile from "./ProfilePage/ViewUserProfile";

export default function SealdealRoutes({settings, setSettings, setBackgroundImage}) {
	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						<ProfilePage
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
