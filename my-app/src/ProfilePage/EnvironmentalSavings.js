import Box from "../Box";

//https://www.npmjs.com/package/@ramonak/react-progress-bar
import ProgressBar from "@ramonak/react-progress-bar";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function EnvironmentalSavings({user}) {
	return (
		<Box className="my-5">
			<div className="grid grid-cols-2 w-full gap-4">
				<div className="col-span-2">
					Thank you {user.name} for helping us save the Environment ! 
				</div>
				
				<div>
					CO2 Emissions reduced
					<ProgressBar completed="30" bgColor="#DAA520"/>
				</div>

				<div>
					Polution reduced
					<ProgressBar completed="40" bgColor="#DAA520"/>
				</div>
				
				<div>
					Polarbears saved
					<ProgressBar completed="50" bgColor="#DAA520"/>
				</div>

				<div>
					Forests preserved
					<ProgressBar completed="60" bgColor="#DAA520" />
				</div>
		
			</div>
			
		</Box>
	);
}
