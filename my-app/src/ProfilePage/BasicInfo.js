/**
 * @param {import('./types').ProfilePageProps} props
 */
export default function BasicInfo({user}) {
	console.log("woop", user.name);
	return (
		<div id="content">
			<div style={{backgroundImage: user.avatarUrl}}></div>
			<div style={{color: "black"}}>{user.name}!!</div>
		</div>
	);
}
