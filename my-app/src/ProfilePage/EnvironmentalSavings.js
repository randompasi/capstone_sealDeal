import Box from "../Box";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function EnvironmentalSavings({user}) {
	return (
		<Box className="my-5">
			<div className="grid grid-cols-3 w-full">Environmental savings {user.name}</div>
		</Box>
	);
}
