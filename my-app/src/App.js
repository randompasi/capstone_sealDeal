import "./App.css";
import SealdealRoutes from "./Routes";
import defaultBackground from "./assets/BackgroundImages/bg0.jpg";
import {ProvideAuth, useAuth} from "./auth/authContext";
import LoginPage from "./LoginPage/LoginPage";
import Navbar from "./Navbar";
import {useState} from "react";
import {loadImageToBase64, makeCssUrl} from "./common/utils";
import {useAsyncEffect} from "./utils/hooks";
import {patchUser} from "./api/api";

function RequireLogin() {
	const authContext = useAuth();
	const user = authContext.user;
	const [settings, setSettings] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState(null);

	//Update state change to DB on SettingsModal call
	useAsyncEffect(async () => {
		if (!user || !backgroundImage) return;
		const base64 = await loadImageToBase64(backgroundImage);
		await patchUser(authContext, {
			backgroundBase64: base64,
		});
	}, [user, backgroundImage]);

	if (!user) {
		return <LoginPage />;
	}

	return (
		<div className="text-white h-screen w-screen">
			<Navbar setSettings={setSettings} />
			<main
				className="flex-auto min-h-screen bg-cover pb-6"
				style={{
					/**
					 * TODO: Support for double format. Is it needed ?
					 * backgroundImage: [backgroundImage].map(makeCssUrl).join(","),
					 */
					backgroundImage: makeCssUrl(
						//Fallback values for bg image: state -> database -> hardcoded default
						backgroundImage ?? authContext.user.backgroundBase64 ?? defaultBackground
					),
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
