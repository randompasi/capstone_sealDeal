import Box from "../Box";
import Avatar from "./Avatar";

/**
 * @param {import('../types').ProfilePageProps} props
 */
export default function BasicInfo({user}) {
	return (
		<Box className="my-5">
			<div className="grid grid-cols-3 w-full">
				<div>
					<Avatar url={user.avatarUrl} />
				</div>
				<ul className="list-none">
					<li>{user.name}</li>
					<li>22.10.1987</li>
					<li>Helsinki</li>
				</ul>
				<ul className="list-none">
					<li>Sealdeal PRO Seller</li>
					<li>162 Profile Likes</li>
				</ul>
			</div>
		</Box>
	);
}
