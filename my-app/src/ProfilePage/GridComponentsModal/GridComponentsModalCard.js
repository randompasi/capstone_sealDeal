import {useDrag} from "react-dnd";
/**
 * @param {ProfilePage.GridComponentsModalCardProps} props
 */
export default function GridComponentsModalCard(props) {
	const [, dragRef] = useDrag({
		type: "GridComponentCard",
	});
	return <div ref={dragRef}>{props.children}</div>;
}
