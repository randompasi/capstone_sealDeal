import {clamp} from "lodash";
import {useCallback, useRef} from "react";
import {useDrop} from "react-dnd";
import {RiDeleteBin2Line as DeleteIcon} from "react-icons/ri";

/**
 * @param {EditableGrid.EditableGridItemProps} props
 */
export function EditableGridItem(props) {
	/** @type {React.MutableRefObject<HTMLDivElement>} */
	const borderRef = useRef();
	const content = getContent(props.item, props.gridProps);
	const [{canDrop}, dropRef] = useDrop(() => ({
		accept: "GridComponentCard",
		collect: collectDropProps,
		drop(item) {
			/** @type {EditableGrid.GridIdentifier} */
			const newItem = item.id;
			const currentItem = props.item;
			const newState = props.gridProps.gridStateProps.gridState.map((_) => ({
				a: _.a === currentItem ? newItem : _.a,
				b: _.b === currentItem ? newItem : _.b,
			}));
			props.gridProps.gridStateProps.setGridState(newState);
		},
	}));

	let dragging = false;

	/** @type {React.MouseEventHandler} */
	const mouseDown = useCallback(
		(event) => {
			event.preventDefault();
			if (dragging) {
				return;
			}
			dragging = true;
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
			props.setDragging(props.item);

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
				dragging = false;
				const {style} = borderElem;
				style.setProperty("--seal-editable-grid-border-weight-dynamic", "0px");
				borderElem.classList.remove("sealdeal-editable-grid-border-active");
				document.body.removeEventListener("mouseup", mouseUp);
				document.body.removeEventListener("mousemove", mouseMove);
				props.setDragging(null);
				props.resize(direction, mouseMoved, props.item);
			};

			document.body.addEventListener("mouseup", mouseUp);
			document.body.addEventListener("mousemove", mouseMove);
		},
		[props.setDragging, props.resize, props.item]
	);

	const removeItemFromGrid = () => {
		const {item} = props;
		props.gridProps.gridStateProps.setGridState(
			props.gridProps.gridStateProps.gridState.map((_) => ({
				a: _.a === item ? null : _.a,
				b: _.b === item ? null : _.b,
			}))
		);
	};

	const draggingClassName = props.dragging ? "seal-editable-grid-resize-target" : "";
	const emptyBlockClassName = props.item === null ? "seal-editable-grid-empty" : "";

	if (props.item === null) {
		return null;
	}

	const style = {
		gridArea: props.item || `null-${props.index}`,
		color: canDrop ? "red" : undefined,
	};

	return (
		<div
			ref={dropRef}
			className={`w-full h-full relative seal-editable-grid-item ${draggingClassName} ${emptyBlockClassName}`}
			style={style}
		>
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
			<button
				className="absolute top-2 right-4 text-xl seal-editable-grid-btn"
				onClick={removeItemFromGrid}
			>
				<DeleteIcon />
			</button>
			{content}
		</div>
	);
}

/**
 * @param {EditableGrid.GridIdentifier} item
 * @param {EditableGrid.EditableGridProps} gridProps
 */
function getContent(item, {components, ...profilePageProps}) {
	const Component = components[item];
	if (!Component) {
		console.warn(`No component handler configured for ${item}`);
		return null;
	}
	return <Component {...profilePageProps} />;
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
