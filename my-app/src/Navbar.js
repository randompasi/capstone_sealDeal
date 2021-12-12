import {useAuth} from "./auth/authContext";
import Box from "./Box";
import {CgLogOut} from "react-icons/cg"; //react-icons.github.io/react-icons
import {IoSettingsOutline} from "react-icons/io5";
import logoImage from "./assets/logo.png";

const makeCssUrl = (url) => `url(${url})`;

export default function Navbar({setSettings}) {
	const {user, signout} = useAuth();
	if (!user) {
		return null;
	}
	console.log(logoImage);
	console.log(makeCssUrl(logoImage));
	return (
		<header>
			<Box className="pt-2 pb-2" title="">
				<div className="flex items-center justify-between flex-wrap text-xl">
					<div
						className="flex items-center flex-shrink-0 text-white mr-6 w-12"
						style={{backgroundImage: logoImage, minWidth: "200px"}}
					>
						<img src={logoImage}></img>
					</div>
					{/*<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
						<NavItem label="Menu 1" link="/" />
						<NavItem label="Menu 2" link="/" />
					</div>*/}
					<div className="flex flex-row items-center">
						<button
							style={{borderColor: "white"}}
							className="flex items-center border-r-2 border-solid"
							onClick={() => {
								setSettings(true);
							}}
						>
							<IoSettingsOutline className="mr-4 text-3xl"></IoSettingsOutline>
						</button>
						<NavItem
							className="m-4 flex justify-self-end"
							link="/"
							label={<CgLogOut className="text-3xl ml-4" onClick={signout}></CgLogOut>}
						/>
					</div>
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
