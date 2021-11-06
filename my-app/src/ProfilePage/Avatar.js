/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const size = 100;
	/* style={{
				background: `center / contain no-repeat url("${url}")`,
				display: "inline-block",
				height: size,
				width: size,
			}}*/
	return (
		<div className="mr-3">
			<img 
				style={{
					height: size,
					width: size,
					borderRadius: 50
				}}
				src={url}
			/>
		</div>
	);
}
