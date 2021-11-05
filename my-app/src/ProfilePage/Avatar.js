/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const size = 100;
	return (
		<div
			style={{
				background: `center / contain no-repeat url("${url}")`,
				display: "inline-block",
				height: size,
				width: size,
			}}
		></div>
	);
}
