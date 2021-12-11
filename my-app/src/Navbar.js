import {useAuth} from "./auth/authContext";
import Box from "./Box";
import {CgLogOut} from "react-icons/cg"; //react-icons.github.io/react-icons
import {IoSettingsOutline} from "react-icons/io5";

export default function Navbar({setSettings}) {
	const {user, signout} = useAuth();
	if (!user) {
		return null;
	}

	return (
		<header>
			<Box title="">
				<div className="flex items-center justify-between flex-wrap text-xl">
					<div className="flex items-center flex-shrink-0 text-white mr-6">Logo</div>
					<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
						<NavItem label="Menu 1" link="/" />
						<NavItem label="Menu 2" link="/" />
					</div>
					<button
						style={{borderColor: "white"}}
						className="flex items-center border-r-2 border-solid focus:shadow-outline focus:outline-none"
						onClick={() => {
							setSettings(true);
						}}
					>
						<IoSettingsOutline className="mr-4 text-3xl"></IoSettingsOutline>
					</button>
					<NavItem
						className="m-4"
						link="/"
						label={<CgLogOut className="text-3xl ml-4" onClick={signout}></CgLogOut>}
					/>
				</div>
			</Box>
		</header>
	);
}

function NavItem(props) {
	return (
		<a href={props.link} className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 font-bold">
			{props.label}
		</a>
	);
}
