/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const size = 100;
	const makeCssUrl = (url) => `url('${url}')`;

	return (
		<div>
			<div
				id="profile-image"
				className="mr-3"
				style={{
					overflow: "hidden",
					height: size,
					width: size,
					borderRadius: 50,
					border: "2px solid #ccc",
					backgroundImage: makeCssUrl(url),
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			></div>
		</div>
	);
}
