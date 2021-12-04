import {useAuth} from "./auth/authContext";
import Box from "./Box";

export default function Navbar() {
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
						<NavItem label="Menu 1" />
						<NavItem label="Menu 2" />
					</div>
					<NavItem label={<button onClick={signout}>Logout</button>} />
				</div>
			</Box>
		</header>
	);
}

function NavItem(props) {
	return (
		<a href="/" className="block mt-4 lg:inline-block lg:mt-0 text-white mr-4 font-bold">
			{props.label}
		</a>
	);
}
