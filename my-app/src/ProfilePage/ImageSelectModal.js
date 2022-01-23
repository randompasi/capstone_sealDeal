import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal

export default function ImageSelectModal({openState, setImage, imageSources, headerText}) {
	const images = imageSources;

	return (
		<Modal
			id="avatar-modal"
			isOpen={openState.isOpen}
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
								openState.toggle();
								setImage(src);
							}}
						>
							<img
								className="w-100 h-100 border-4 border-gray-700 hover:border-blue-300"
								style={{
									height: 125,
									width: 200,
								}}
								src={src}
							/>
						</div>
					))}
				</div>
			</div>
			<div className="w-100">
				<button
					className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
					onClick={() => {
						openState.toggle();
					}}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
}
