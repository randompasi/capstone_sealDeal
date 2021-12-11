import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProfilePage from "./ProfilePage/ProfilePage";

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
			</Routes>
		</Router>
	);
}
