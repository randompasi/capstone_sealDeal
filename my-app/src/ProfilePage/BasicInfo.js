import Avatar from "./Avatar";

/**
 * @param {import('./types').ProfilePageProps} props
 */
export default function BasicInfo({user}) {
	return (
		<div id="content">
			<Avatar url={user.avatarUrl} />
			<div style={{color: "black"}}>{user.name}!!</div>
		</div>
	);
}
