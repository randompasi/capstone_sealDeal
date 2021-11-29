import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import ProfilePage from "./ProfilePage/ProfilePage";

export default function SealdealRoutes() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ProfilePage />} />
			</Routes>
		</Router>
	);
}
