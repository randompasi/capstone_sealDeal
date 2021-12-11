import "./App.css";
import SealdealRoutes from "./Routes";
import jpgBackground from "./assets/BackgroundImages/bg1.jpg";
import {ProvideAuth, useAuth} from "./auth/authContext";
import LoginPage from "./LoginPage/LoginPage";
import Navbar from "./Navbar";
import {useState} from "react";

const makeCssUrl = (url) => `url(${JSON.stringify(url)})`;

function RequireLogin() {
	const {user} = useAuth();
	if (!user) {
		return <LoginPage />;
	}

	const [settings, setSettings] = useState(false);

	const [backgroundImage, setBackgroundImage] = useState(jpgBackground);

	return (
		<div className="text-white h-screen w-screen">
			<Navbar setSettings={setSettings} />
			<main
				className="flex-auto min-h-screen bg-cover pb-6"
				style={{
					/**
					 * TODO: Selection support for original format support
					 * backgroundImage: [backgroundImage].map(makeCssUrl).join(","),
					 */
					backgroundImage: makeCssUrl(backgroundImage),
				}}
			>
				<SealdealRoutes
					settings={settings}
					setSettings={setSettings}
					setBackgroundImage={setBackgroundImage}
				/>
			</main>
			<footer className="w-full h-24 bg-gray-700"></footer>
		</div>
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
