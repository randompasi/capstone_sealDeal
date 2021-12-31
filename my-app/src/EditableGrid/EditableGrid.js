import {clamp, findIndex, findLastIndex, times} from "lodash";
import uniq from "lodash/uniq";
import {useCallback, useRef, useState} from "react";
import {cloneDeepJson, impossibleCase} from "../common/utils";
import Achievements from "../ProfilePage/Achievements";
import BasicInfo from "../ProfilePage/BasicInfo";
import EnvironmentalSavings from "../ProfilePage/EnvironmentalSavings";
import "./EditableGrid.css";

/**
 * @param {EditableGrid.GridIdentifier} item
 * @param {ProfilePage.ProfilePageProps} profilePageProps
 */
function getContent(item, profilePageProps) {
	switch (item) {
		case "BasicInfo":
			return <BasicInfo {...profilePageProps} />;
		case "Achievements":
			return <Achievements {...profilePageProps} />;
		case "EnvironmentalSavings":
			return <EnvironmentalSavings {...profilePageProps} />;
		default:
			return impossibleCase(item);
	}
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

/**
 * @param {EditableGrid.EditableGridItemProps} props
 */
function EditableGridItem(props) {
	/** @type {React.MutableRefObject<HTMLDivElement>} */
	const borderRef = useRef();
	const content = getContent(props.item, props.profilePageProps);

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

	const draggingClassName = props.dragging ? "seal-editable-grid-resize-target" : "";
	const emptyBlockClassName = props.item === null ? "seal-editable-grid-empty" : "";

	if (props.item === null) {
		return null;
	}

	const style = {
		gridArea: props.item || `null-${props.index}`,
	};

	return (
		<div
			className={`w-full h-full relative ${draggingClassName} ${emptyBlockClassName}`}
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
			{content}
		</div>
	);
}

/**
 * @param {{profilePageProps: ProfilePage.ProfilePageProps}} props
 */
export default function EditableGrid(props) {
	const [dragging, setDragging] = useState(null);
	/** @type {EditableGrid.GridModel} */
	const gridDefaultState = [
		{a: "BasicInfo", b: "Achievements"},
		{a: "EnvironmentalSavings", b: "EnvironmentalSavings"},
	];
	const [gridState, setGridState] = useState(gridDefaultState);
	const gridItems = getGridItems(gridState);
	const {profilePageProps} = props;

	const resize = useCallback(makeResizeCallback(gridState, setGridState), [
		gridState,
		setGridState,
	]);

	/** @type {Record<string, string>} */
	const style = {
		gridTemplateAreas: parseGridTemplateAreas(gridState),
	};

	return (
		<div className="grid gap-4 w-full seal-editable-grid" style={style}>
			{gridItems.map((item, i) => (
				<EditableGridItem
					key={item || `null-${i}`}
					index={i}
					item={item}
					profilePageProps={profilePageProps}
					dragging={dragging}
					setDragging={setDragging}
					resize={resize}
				></EditableGridItem>
			))}
		</div>
	);
}

/**
 * @param {EditableGrid.GridModel} gridState
 * @returns {string} CSS string that can be used for value to grid-template-areas rule
 */
function parseGridTemplateAreas(gridState) {
	return gridState.map((state) => `"${state.a || "."} ${state.b || "."}"`).join("\n");
}

/**
 * @param {EditableGrid.GridModel} gridState
 * @returns {EditableGrid.GridIdentifier[]}
 */
function getGridItems(gridState) {
	return uniq(gridState.flatMap((_) => [_.a, _.b]));
}

/**
 * @param {EditableGrid.GridModel} gridState
 * @param {(newState: EditableGrid.GridModel) => any} setGridState
 * @returns {EditableGrid.EditableGridItemProps["resize"]}
 * */
const makeResizeCallback = (gridState, setGridState) => (border, amount, item) => {
	const rowHasItem = (_) => _.a === item || _.b === item;
	const findFn = border === "bottom" ? findLastIndex : findIndex;
	const currentRowIndex = findFn(gridState, rowHasItem);

	if (currentRowIndex === -1) {
		console.warn("Cannot find item from current grid state");
		return;
	}
	const currentRow = gridState[currentRowIndex];

	const newState = cloneDeepJson(gridState);

	const isScalingUp = amount * (border === "top" || border === "left" ? -1 : 1) > 0;
	const isAxisX = border === "left" || border === "right";

	if (isAxisX) {
		if (isScalingUp) {
			const currentColumn = currentRow.a === item ? "a" : "b";
			const moveToColumn = currentColumn === "a" ? "b" : "a";

			// Move possibly existing item out of the way
			const currentOccupant = currentRow[moveToColumn];
			if (currentOccupant) {
				if (currentOccupant === item) {
					return; // We already occupy this space? Skip
				}

				let rowsCount = 0;
				for (const row of newState) {
					if (row[moveToColumn] === currentOccupant) {
						row[moveToColumn] = null;
						rowsCount++;
					}
				}

				/** @type{EditableGrid.GridModel} */
				const newRowsForOccupant = times(rowsCount, () => ({
					a: null,
					b: null,
					[moveToColumn]: currentOccupant,
				}));
				newState.splice(currentRowIndex + 1, 0, ...newRowsForOccupant);
			}

			for (const row of newState) {
				if (row[currentColumn] === item) {
					row[moveToColumn] = item;
				}
			}
		} else {
			const clearColumn = border === "left" ? "a" : "b";
			for (const row of newState) {
				if (row[clearColumn] === item) {
					row[clearColumn] = null;
				}
			}
		}
	} else {
		// Resizing up/down
		if (isScalingUp) {
			const replacementRows = [
				newState[currentRowIndex - 1],
				currentRow,
				newState[currentRowIndex + 1],
			].flatMap((row, i) => {
				const indexToReplace = border === "top" ? 0 : 2;
				if (indexToReplace !== i) {
					return row || [];
				}

				const newRow = {
					a: currentRow.a === item ? item : null,
					b: currentRow.b === item ? item : null,
				};
				const fullRow = Boolean(newRow.a && newRow.b);
				if (!fullRow && newRow.a && !row.a) {
					return {
						a: newRow.a,
						b: row.b,
					};
				}
				if (!fullRow && newRow.b && !row.b) {
					return {
						a: row.a,
						b: newRow.b,
					};
				}
				const newRows = [row, newRow];
				if (border === "bottom") {
					newRows.reverse();
				}
				return newRows;
			});
			newState.splice(
				Math.max(0, currentRowIndex - 1),
				currentRowIndex === 0 ? 2 : 3,
				...replacementRows
			);
		} else {
			const newRows = [
				{
					a: currentRow.a === item ? null : currentRow.a,
					b: currentRow.b === item ? null : currentRow.b,
				},
			].filter((_) => _.a || _.b);
			newState.splice(currentRowIndex, 1, ...newRows);
		}
	}

	const newStateIsValid =
		// Make sure scaling down didn't result in the item getting removed altogether.
		// Removing items is done with another explicit remove-function.
		newState.some(rowHasItem);

	if (newStateIsValid) {
		const withoutEmptyRows = newState.filter((_) => _.a || _.b);
		setGridState(withoutEmptyRows);
	}
};
