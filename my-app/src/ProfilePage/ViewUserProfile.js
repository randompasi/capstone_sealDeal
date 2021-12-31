import {useParams} from "react-router-dom";
import ProfilePage from "./ProfilePageInfo";

export default function ViewUserProfile() {
	const params = useParams();
	const userId = Number(params.id);

	return (
		<div className="h-screen w-full">
			<ProfilePage user={{id: userId}} settingsProps={null} />
		</div>
	);
}
