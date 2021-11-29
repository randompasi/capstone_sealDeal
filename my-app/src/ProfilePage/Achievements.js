import Box from "../Box";
import Achievement from "./Achievement";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Achievements({user}) {
	const parsedAcievements = [];
	user.achievements.forEach((element, index) => {
		parsedAcievements.push(<Achievement key={index} {...element} />);
	});

	return (
		<Box className="my-5" title="Achievements">
			<div className="grid grid-cols5 w-full gap-2">
				<div className="col-span-5 flex justify-start">{user.name}&apos;s Achievements!</div>

				{parsedAcievements}
			</div>
		</Box>
	);
}
