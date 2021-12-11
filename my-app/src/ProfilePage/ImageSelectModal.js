import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal

export default function ImageSelectModal({
	showModal,
	setModal,
	setImage,
	imageSources,
	headerText,
}) {
	const images = imageSources;

	return (
		<Modal
			id="avatar-modal"
			isOpen={showModal}
			contentLabel="Settings Modal"
			ariaHideApp={false}
			style={{
				overlay: {display: "flex", justifyContent: "center"},
				content: {
					flex: "1",
					maxWidth: "970px",
					position: "relative",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					height: "95%",
				},
			}}
		>
			<h1 className="text-3xl">{headerText}</h1>
			<div className="flex-1 w-full">
				<div className="grid grid-cols-4 gap-4 w-full p-8">
					{images.map((src, index) => (
						<div
							key={index}
							className="h-36"
							onClick={() => {
								setModal(false);
								setImage(src);
							}}
						>
							<img
								style={{
									height: "100%",
									width: "100%",
									border: "2px solid #ccc",
								}}
								src={src}
							/>
						</div>
					))}
				</div>
			</div>
			<div className="w-100">
				<button
					style={{backgroundColor: "rgb(56, 72, 97)", color: "#FFFFFF"}}
					className="w-32 h-8 rounded-3xl min-h-40"
					onClick={() => {
						setModal(false);
					}}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
}
