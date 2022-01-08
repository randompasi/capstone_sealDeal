import {useDragLayer} from "react-dnd";
import Modal from "../../common/components/Modal";
import {objectKeys} from "../../common/utils";
import GridComponentsModalCard from "./GridComponentsModalCard";

/**
 * @param {ProfilePage.GridComponentsModalProps} props
 */
export default function GridComponentsModal({openState, gridComponents, gridStateProps}) {
	const dragProps = useDragLayer((monitor) => ({
		isDragging: monitor.isDragging(),
	}));
	const usedComponents = new Set(
		gridStateProps.gridState.flatMap((_) => [_.a, _.b]).filter(Boolean)
	);
	const availableComponents = objectKeys(gridComponents).filter((_) => !usedComponents.has(_));

	const hideWhenDraggingStyle = {
		display: dragProps.isDragging ? "none" : undefined,
	};

	return (
		<Modal
			title="Valitse komponentit profiilisivulle"
			isOpen={openState.isOpen}
			contentLabel="Grid components selection"
			onClose={openState.toggle}
			styles={{
				overlay: hideWhenDraggingStyle,
				content: hideWhenDraggingStyle,
			}}
		>
			<ul className="grid grid-cols-4 gap-4 w-full p-8">
				{!availableComponents.length && <li>Ei jäljellä olevia widgettejä</li>}
				{openState.isOpen &&
					availableComponents.map((name) => (
						<li key={name} className="h-36">
							<GridComponentsModalCard item={name} />
						</li>
					))}
			</ul>
		</Modal>
	);
}
