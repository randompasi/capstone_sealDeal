import Box from "../Box";
import Avatar from "./Avatar";
import crown from "../assets/crown_2.png";
import SectionTitle from "../common/components/SectionTitle";
import FollowerList from "./Followers/FollowerList";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function BasicInfo({user}) {
	return (
		<Box className="my-5" title="">
			<div className="grid grid-cols-5 w-full">
				<div>
					<Avatar url={user.avatarUrl} />
				</div>
				<div className="col-span-2 h-2/3 mt-2 w-full">
					<SectionTitle>{user.name + ", " + user.city}</SectionTitle>

					<div className="flex flex-row w-1/4 ">
						<div className="flex flex-col m-4 ml-3 justify-center items-center">
							<strong>10</strong>
							<span className="text-sm">Mutuals</span>
						</div>
						<div className="flex flex-col m-4 justify-center items-center">
							<strong>24</strong>
							<span className="text-sm">Sales</span>
						</div>
					</div>
				</div>
				<div className="col-span-2">
					<div className="h-1 flex flex-col items-end">
						<div className="flex flex-col items-center">
							<img style={{height: 30, width: 40}} src={crown} />
							<SectionTitle>Sealdeal PRO Seller</SectionTitle>

							<FollowerList user={user} />
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
}
