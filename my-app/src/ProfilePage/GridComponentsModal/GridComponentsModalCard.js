import {useDrag} from "react-dnd";
import {GRID_CARD_DND_TYPE} from "../../EditableGrid/editableGridUtils";
/**
 * @param {ProfilePage.GridComponentsModalCardProps} props
 */
export default function GridComponentsModalCard(props) {
	const [, dragRef] = useDrag({
		type: GRID_CARD_DND_TYPE,
		item: {
			id: props.item,
		},
	});
	return (
		<div ref={dragRef}>
			<div className="p-2 text-center cursor-pointer min-w-100 inline-block h-100 border-4 border-gray-700 hover:border-blue-300">
				{props.item}
			</div>
		</div>
	);
}
