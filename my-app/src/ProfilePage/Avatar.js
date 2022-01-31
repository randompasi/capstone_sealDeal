/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const makeCssUrl = (url) => `url('${url}')`;

	return (
		<div>
			<div
				id="profile-image"
				className="mr-3"
				style={{
					overflow: "hidden",
					width: "100%",
					borderRadius: "50%",
					border: "2px solid #ccc",
					aspectRatio: "1 / 1",
					backgroundImage: makeCssUrl(url),
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			></div>
		</div>
	);
}
