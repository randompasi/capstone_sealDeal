import Box from "../Box";
import Achievement from "./Achievement";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Achievements({user}) {
	const parsedAcievements = [];
	user.achievements?.forEach((element, index) => {
		parsedAcievements.push(<Achievement key={index} {...element} />);
	});

	return (
		<Box title="Achievements">
			<div className="grid grid-cols-5  gap-x-2 items-stretch w-full">
				<div className="col-span-5 flex justify-start">{user.name}&apos;s Achievements!</div>
				{parsedAcievements}
			</div>
		</Box>
	);
}
