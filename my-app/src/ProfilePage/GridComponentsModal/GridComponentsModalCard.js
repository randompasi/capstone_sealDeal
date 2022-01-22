import {Component} from "react";
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
			<div className="p-2 pointer-events-none w-full h-full cursor-pointer min-w-100 inline-block overflow-hidden border-4 border-gray-700 hover:border-blue-300">
				<ComponentPreviewContent {...props} />
			</div>
		</div>
	);
}

// Tries to preview the content of the card, but falls back on title if the preview errors.
class ComponentPreviewContent extends Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false};
	}
	static getDerivedStateFromError() {
		return {hasError: true};
	}
	componentDidCatch(error, errorInfo) {
		console.warn(error, errorInfo);
	}
	render() {
		if (this.state.hasError) {
			return <div className="text-gray-500">{this.props.title}</div>;
		}
		return this.props.previewContent;
	}
}
