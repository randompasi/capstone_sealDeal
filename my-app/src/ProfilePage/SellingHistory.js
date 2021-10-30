import Box from "../Box";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function SellingHistory({user}) {
	return (
		<Box className="my-5">
			<div className="grid grid-cols-3 w-full">Selling history {user.name}</div>
		</Box>
	);
}
