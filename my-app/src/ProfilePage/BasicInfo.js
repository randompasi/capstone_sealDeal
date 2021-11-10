import Box from "../Box";
import Avatar from "./Avatar";
import crown from "../assets/crown_2.png";
import SectionTitle from "../common/components/SectionTitle";

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
				<div className="col-span-2">
					<SectionTitle>{user.name}</SectionTitle>
					<div className="h-1/2 flex flex-col justify-end">
						<span>{user.bday}</span>
						<span>{user.city}</span>
					</div>
				</div>
				<div className="col-span-2">
					<div className="h-1 flex flex-col items-end">
						<div className="flex flex-col items-center">
							<img style={{height: 30, width: 40}} src={crown} />
							<SectionTitle>Sealdeal PRO Seller</SectionTitle>

							<div className="h-100 mt-3">
								<span>162 Profile Likes</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Box>
	);
}
