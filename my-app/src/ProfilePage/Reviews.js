import Box from "../Box";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Reviews({user}) {
	return (
		<Box className="my-5" title="Reviews">
			<div className="grid grid-cols-3 w-full">Reviews {user.name}</div>
		</Box>
	);
}
