import Modal from "../common/components/Modal";

export default function FeedbackDialog() {
	const modalStyles = {
		overlay: {
			width: 500,
			height: 500,
			bottom: "10%",
			right: "10%",
		},
	};
	return (
		<Modal styles={modalStyles} isOpen={true} title="Feedback">
			<div>Hello</div>
		</Modal>
	);
}
