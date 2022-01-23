import {clamp} from "lodash";
import {useCallback, useRef, useState} from "react";
import {useDrag, useDrop} from "react-dnd";
import {RiDeleteBin2Line as DeleteIcon} from "react-icons/ri";
import {AiOutlineDrag as DragIcon} from "react-icons/ai";
import {
	GRID_CARD_DND_TYPE,
	isEmptySlot,
	renderItemComponent,
	replaceGridStateItems,
} from "./editableGridUtils";

/**
 * @param {EditableGrid.EditableGridItemProps} props
 */
export function EditableGridItem(props) {
	const {item} = props;
	const emptySlot = isEmptySlot(item);

	/** @type {React.MutableRefObject<HTMLDivElement>} */
	const borderRef = useRef();
	const content = emptySlot ? null : renderItemComponent(item, props.gridProps);
	// Allow dragging some other slot on top of this one
	const [{canDrop}, dropRef] = useDrop(() => ({
		accept: GRID_CARD_DND_TYPE,
		collect: collectDropProps,
		drop(dropItem) {
			const {shouldClearOriginals} = dropItem;
			/** @type {EditableGrid.GridIdentifier} */
			const newItem = dropItem.id;
			const currentItem = props.item;
			let newState = props.gridProps.gridStateProps.gridState;
			if (shouldClearOriginals) {
				newState = replaceGridStateItems(newState, newItem, null);
			}
			newState = replaceGridStateItems(newState, currentItem, newItem);
			props.gridProps.gridStateProps.setGridState(newState);
		},
		canDrop() {
			return true;
		},
	}));
	// Allow dragging this slot on top of some other slot
	const [, dragRef, dragPreviewRef] = useDrag({
		type: GRID_CARD_DND_TYPE,
		item: {
			id: props.item,
			shouldClearOriginals: true,
		},
	});
	const [isResizing, setIsResizing] = useState(false);

	/** @type {React.MouseEventHandler} */
	const mouseDown = useCallback(
		(event) => {
			event.preventDefault();
			if (isResizing) {
				return;
			}
			setIsResizing(true);
			let mouseMoved = 0;

			/** @type {HTMLDivElement} */
			// @ts-ignore
			const borderElem = event.target;
			/** @type {string} */
			const _direction = borderElem.dataset?.direction;
			/** @type {EditableGrid.GridResizeDirection} */
			// @ts-ignore
			const direction = _direction;

			if (!direction) {
				console.warn("Cannot find direction from dragged element");
				return;
			}

			const mouseMove = (/** @type {MouseEvent} */ event) => {
				mouseMoved = clamp(
					Math.round(mouseMoved + getMouseMovedRelativeAmount(event, direction)),
					-200,
					800
				);

				const {style} = borderElem;
				style.setProperty("--seal-editable-grid-border-weight-dynamic", mouseMoved + "px");
				borderElem.classList.add("sealdeal-editable-grid-border-active");
			};
			const mouseUp = () => {
				setIsResizing(false);
				const {style} = borderElem;
				style.setProperty("--seal-editable-grid-border-weight-dynamic", "0px");
				borderElem.classList.remove("sealdeal-editable-grid-border-active");
				document.body.removeEventListener("mouseup", mouseUp);
				document.body.removeEventListener("mousemove", mouseMove);
				if (typeof props.item === "string") {
					props.resize(direction, mouseMoved, props.item);
				}
			};

			document.body.addEventListener("mouseup", mouseUp);
			document.body.addEventListener("mousemove", mouseMove);
		},
		[props.resize, props.item]
	);

	const {gridStateProps} = props.gridProps;
	const {gridState} = gridStateProps;

	const removeItemFromGrid = () => {
		props.gridProps.gridStateProps.setGridState(replaceGridStateItems(gridState, item, null));
	};

	const draggingClassName = isResizing ? "seal-editable-grid-resize-target" : "";
	const emptyBlockClassName = emptySlot ? "seal-editable-grid-empty" : "";

	// We add one empty row to the top and one to the bottom so that the whole
	// grid can be made taller by dragging items tehre. However, we can show those
	// much smaller if we are not currently dragging.
	const isRowMockedForEmptySlots =
		props.index === 0 || props.index >= props.gridProps.gridStateProps.gridState.length;
	const style = {
		gridArea: item.toString(),
		cursor: canDrop ? "pointer" : undefined,
		minHeight: !isRowMockedForEmptySlots || canDrop ? "100px" : undefined,
	};

	const emptySlotStyle = canDrop ? {border: "2px dashed gray"} : null;

	return (
		<div
			ref={dropRef}
			className={`w-full h-full relative seal-editable-grid-item ${draggingClassName} ${emptyBlockClassName}`}
			style={style}
		>
			<div className="w-full h-full">
				{!emptySlot && (
					<div className="w-full h-full" ref={dragPreviewRef}>
						<div className="w-full h-full">
							<div onMouseDown={mouseDown} ref={borderRef}>
								<div
									data-direction="left"
									className="seal-editable-grid-border seal-editable-grid-border-left"
								/>
								<div
									data-direction="right"
									className="seal-editable-grid-border seal-editable-grid-border-right"
								/>
								<div
									data-direction="top"
									className="seal-editable-grid-border seal-editable-grid-border-top"
								/>
								<div
									data-direction="bottom"
									className="seal-editable-grid-border seal-editable-grid-border-bottom"
								/>
							</div>
							<div className="absolute top-2 right-4 text-xl seal-editable-grid-btn">
								<button onClick={removeItemFromGrid}>
									<DeleteIcon />
								</button>
								<button ref={dragRef}>
									<DragIcon />
								</button>
							</div>
							{content}
						</div>
					</div>
				)}
				{emptySlot && (
					<div
						className="w-full h-full inline-block text-center rounded-sm"
						style={emptySlotStyle}
						title="Empty slot"
					></div>
				)}
			</div>
		</div>
	);
}

/**
 * @param {MouseEvent} event
 * @param {EditableGrid.GridResizeDirection} direction
 */
function getMouseMovedRelativeAmount(event, direction) {
	if (direction === "left" || direction === "right") {
		return event.movementX;
	} else {
		return event.movementY;
	}
}

function collectDropProps(monitor) {
	return {
		canDrop: monitor.canDrop(),
	};
}
