import ReactModal from "react-modal";

/**
 * @param {CommonComponents.ModalProps} props
 */
export default function Modal(props) {
	return (
		<ReactModal
			isOpen={props.isOpen}
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
			<h1 className="text-3xl">{props.title}</h1>
			<div className="flex-1 w-full">
				{props.children}
				<div className="w-100">
					<button
						className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
						onClick={props.onCancel}
					>
						Cancel
					</button>
				</div>
			</div>
		</ReactModal>
	);
}
