/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const size = 100;
	return (
		<div className="mr-3">
			<img
				style={{
					height: size,
					width: size,
					borderRadius: 50,
					border: "2px solid #ccc",
				}}
				src={url}
			/>
		</div>
	);
}
