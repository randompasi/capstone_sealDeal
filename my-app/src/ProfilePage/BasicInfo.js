import Box from "../Box";
import Avatar from "./Avatar";
import crown from "../assets/crown_2.png";
import SectionTitle from "../common/components/SectionTitle";
import FollowerList from "./Followers/FollowerList";
import {useAuth} from "../auth/authContext";
/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function BasicInfo({user}) {
	const authContext = useAuth();
	const userC = authContext.user;
	return (
		<Box title="">
			<div className="grid grid-cols-3 md:grid-cols-5 w-full flex-wrap">
				<div className="m-2 md:m-0">
					<Avatar url={user.avatarUrl} />
				</div>
				<div className="col-span-2 mt-2 w-full text-center">
					<SectionTitle>{user.name + ", " + user.city}</SectionTitle>

					<div className="grid grid-cols-2 mt-2 text-center">
						<div className="flex flex-col justify-center items-center">
							<strong>10</strong>
							<span className="text-sm">Mutuals</span>
						</div>
						<div className="flex flex-col justify-center items-center">
							<strong>24</strong>
							<span className="text-sm">Sales</span>
						</div>
					</div>
				</div>
				<div className="col-span-3 mt-8 md:mt-2 md:col-span-2">
					<div className="flex flex-col items-center">
						<div className="flex flex-col items-center text-center">
							{getSellerStatus(userC.premium)}
							<FollowerList user={user} />
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
}

function getSellerStatus(isPremium) {
	if (isPremium) {
		return (
			<div className="flex flex-col items-center">
				<img style={{height: 30, width: 40}} src={crown} />
				<SectionTitle>Sealdeal PRO Seller</SectionTitle>
			</div>
		);
	}
	return (
		<div className="mt-4 flex-1 flex flex-col">
			<SectionTitle>Sealdeal Free User</SectionTitle>
		</div>
	);
}
