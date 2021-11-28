import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal

export default function ImageSelectModal({showModal, setModal, setImage, imageSources}) {
	const images = imageSources;
	console.log(images);

	return (
		<Modal
			id="avatar-modal"
			isOpen={showModal}
			//onAfterOpen={afterOpenModal}
			//onRequestClose={closeModal}
			//style={customStyles}
			contentLabel="Example Modal"
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
			<h1 className="text-3xl">Select a new profile picture</h1>
			<div className="flex-1 w-full">
				<div className="grid grid-cols-4 gap-4 w-full p-8">
					{images.map((src, index) => (
						<div
							key={index}
							className="h-36"
							onClick={() => {
								setModal(false);
								setImage(src);
								console.log({showModal});
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
						console.log({showModal});
					}}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
}
