import {useCallback} from "react";
import {useDragLayer} from "react-dnd";
import Modal, {DefaultModalActions} from "../../common/components/Modal";
import {objectKeys} from "../../common/utils";
import {gridDefaultState, renderItemComponent} from "../../EditableGrid/editableGridUtils";
import GridComponentsModalCard from "./GridComponentsModalCard";

/**
 * @param {ProfilePage.GridComponentsModalProps} props
 */
export default function GridComponentsModal({openState, gridComponents, gridStateProps, user}) {
	const ModalActionsComponent = useCallback(
		(props) => {
			const resetGrid = () => {
				gridStateProps.setGridState(gridDefaultState);
				openState.toggle();
			};
			return (
				<>
					<DefaultModalActions {...props} />
					<button className={props.className} onClick={resetGrid}>
						Reset
					</button>
				</>
			);
		},
		[gridStateProps.setGridState, openState.toggle]
	);
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
			ModalActions={ModalActionsComponent}
			styles={{
				overlay: hideWhenDraggingStyle,
				content: hideWhenDraggingStyle,
			}}
		>
			<ul className="w-full p-8">
				{!availableComponents.length && <li>Ei jäljellä olevia widgettejä</li>}
				{openState.isOpen &&
					availableComponents.map((item) => (
						<li key={item} className="h-300 w-full">
							<GridComponentsModalCard
								item={item}
								previewContent={renderItemComponent(item, {
									components: gridComponents,
									gridStateProps,
									user,
								})}
							/>
						</li>
					))}
			</ul>
		</Modal>
	);
}
