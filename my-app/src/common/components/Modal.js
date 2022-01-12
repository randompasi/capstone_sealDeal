import omitBy from "lodash/omitBy";
import ReactModal from "react-modal";

function getOverrides(obj) {
	return omitBy(obj, (_) => _ == null);
}

/**
 * @param {CommonComponents.ModalProps} props
 */
export default function Modal(props) {
	const ModalActions = props.ModalActions || DefaultModalActions;
	return (
		<ReactModal
			isOpen={props.isOpen}
			onRequestClose={props.onClose}
			contentLabel="Settings Modal"
			ariaHideApp={false}
			style={{
				overlay: {
					display: "flex",
					justifyContent: "center",
					zIndex: 20,
					...getOverrides(props.styles?.overlay),
				},
				content: {
					flex: "1",
					position: "relative",
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					// Overrides react-modals default inset CSS property, which doesn't work
					// as well with width sizing as normal margin does.
					inset: undefined,
					margin: 40,
					...getOverrides(props.styles?.content),
				},
			}}
		>
			<h1 className="text-3xl">{props.title}</h1>
			<div className="flex-1 w-full">
				{props.children}
				<div className="w-full flex justify-center">
					<ModalActions
						modalProps={props}
						className="w-32 h-8 ml-2 mr-2 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
					/>
				</div>
			</div>
		</ReactModal>
	);
}

/**
 * @type {CommonComponents.ModalProps["ModalActions"]}
 */
export const DefaultModalActions = (props) => {
	return (
		<button className={props.className} onClick={props.modalProps.onClose}>
			{props.modalProps.closeLabel || "Close"}
		</button>
	);
};
