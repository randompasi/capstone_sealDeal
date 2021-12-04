import "./App.css";
import SealdealRoutes from "./Routes";
import webpBackground from "./assets/profile-bg-optimized.webp";
import jpgBackground from "./assets/profile-bg-optimized.jpg";
import {ProvideAuth, useAuth} from "./auth/authContext";
import LoginPage from "./LoginPage/LoginPage";
import Navbar from "./Navbar";

const makeCssUrl = (url) => `url(${JSON.stringify(url)})`;

function RequireLogin() {
	const {user} = useAuth();
	if (!user) {
		return <LoginPage />;
	}
	return (
		<div className="text-white h-screen w-screen">
			<Navbar />
			<main
				className="flex-auto min-h-screen bg-cover pb-6"
				style={{
					backgroundImage: [webpBackground, jpgBackground].map(makeCssUrl).join(","),
				}}
			>
				<SealdealRoutes />
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
