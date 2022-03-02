import "./App.css";
import SealdealRoutes from "./Routes";
import {ProvideAuth, useAuth} from "./auth/authContext";
import LoginPage from "./LoginPage/LoginPage";
import Navbar from "./Navbar";
import {useState} from "react";
import {BrowserRouter as Router} from "react-router-dom";
import Notifications from "./Notifications/Notifications";
import {ProvideNotifications} from "./Notifications/notificationsProvider";

function RequireLogin() {
	const authContext = useAuth();
	const user = authContext.user;
	const [settings, setSettings] = useState(false);
	const [showPremiumModal, setPremiumModal] = useState(false);

	if (!user) {
		return <LoginPage />;
	}

	return (
		<Router>
			<div className="text-white w-full">
				<Navbar setSettings={setSettings} setPremiumModal={setPremiumModal} />
				<ProvideNotifications>
					<main className="flex-auto bg-cover p-0 m-0 flex">
						<SealdealRoutes
							settings={settings}
							setSettings={setSettings}
							showPremiumModal={showPremiumModal}
							setPremiumModal={setPremiumModal}
						/>
					</main>
					<footer className="w-full h-24 bg-gray-700"></footer>
					<Notifications key={user.id} />
				</ProvideNotifications>
			</div>
		</Router>
	);
}

function App() {
	return (
		<ProvideAuth>
			<RequireLogin />
		</ProvideAuth>
	);
}

export default App;
