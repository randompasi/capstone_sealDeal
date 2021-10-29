import "./App.css";
import Box from "./Box";
import ProfilePage from "./ProfilePage/ProfilePage";

function NavItem(props) {
	return (
		<a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 font-bold">
			{props.label}
		</a>
	);
}

function App() {
	return (
		<div className="text-white">
			<Box>
				<div className="flex items-center flex-shrink-0 text-white mr-6">Logo</div>
				<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
					<NavItem label="Menu 1" />
					<NavItem label="Menu 2" />
				</div>
			</Box>
			<main>
				<ProfilePage />
			</main>
		</div>
	);
}

export default App;
