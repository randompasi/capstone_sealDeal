import "./App.css";
import Box from "./Box";
import ProfilePage from "./ProfilePage/ProfilePage";
import background from "./assets/profile_bg.jpg";

function NavItem(props) {
	return (
		<a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 font-bold">
			{props.label}
		</a>
	);
}

function App() {
	return (
		<div className="text-white h-screen w-screen">
			<header>
				<Box title="">
					<div className="flex items-center justify-between flex-wrap text-xl">
						<div className="flex items-center flex-shrink-0 text-white mr-6">Logo</div>
						<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
							<NavItem label="Menu 1" />
							<NavItem label="Menu 2" />
						</div>
					</div>
				</Box>
			</header>

			<main
				className="flex-auto min-h-screen bg-cover pb-6"
				style={{backgroundImage: 'url("' + background + '")'}}
			>
				<ProfilePage />
			</main>

			<footer className="w-full h-24 bg-gray-700"></footer>
		</div>
	);
}

export default App;
