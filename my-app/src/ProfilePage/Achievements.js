import Box from "../Box";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Achievements({user}) {
	return (
		<Box className="my-5">
			<div className="grid grid-cols-3 w-full">Achievements {user.name}</div>
		</Box>
	);
}
