import {useAuth} from "./auth/authContext";
import Box from "./Box";
import {CgLogOut} from "react-icons/cg"; //react-icons.github.io/react-icons
import {IoSettingsOutline} from "react-icons/io5";
import logoImage from "./assets/logo.png";
import Search from "./Search/Search";
import {useLocation} from "react-router-dom";

export default function Navbar({setSettings, setPremiumModal}) {
	const {user, signout} = useAuth();
	const location = useLocation();
	if (!user) {
		return null;
	}
	const isOwnProfilePage = location.pathname === "/dashboard/";
	const isPublicProfile = location.pathname === "/";

	return (
		<header className="z-10 relative">
			<Box className="pt-2 pb-2" title="">
				<div className="flex items-center justify-between flex-wrap text-xl">
					<div
						className="flex items-center flex-shrink-0 text-white mr-6 w-12"
						style={{backgroundImage: logoImage, minWidth: "200px"}}
					>
						<a href="/">
							<img src={logoImage}></img>
						</a>
					</div>
					<div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
						<Search />
					</div>
					<div className="flex flex-row items-center">
						{isOwnProfilePage && (
							<>
								<p
									onClick={() => {
										setPremiumModal(true);
									}}
									className="mr-4 cursor-pointer hover:underline hover:underline-offset-4"
								>
									<b>Premium</b>
								</p>
								<button
									style={{borderColor: "white"}}
									className="flex items-center border-r-2 border-solid"
									onClick={() => {
										setSettings(true);
									}}
								>
									<IoSettingsOutline className="mr-4 ml-4 text-3xl"></IoSettingsOutline>
								</button>
							</>
						)}
						{isPublicProfile && (
							<>
								<p
									onClick={() => {
										window.open("/dashboard/", "_blank");
									}}
									className="mr-4 cursor-pointer hover:underline hover:underline-offset-4"
								>
									<b>Dashboard</b>
								</p>
							</>
						)}
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
