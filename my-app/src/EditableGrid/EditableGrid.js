import {findIndex, findLastIndex, times} from "lodash";
import {useCallback, useState} from "react";
import {cloneDeepJson} from "../common/utils";
import "./EditableGrid.css";
import {EditableGridItem} from "./EditableGridItem";
import {getAllGridItems} from "./editableGridUtils";

/**
 * @param {EditableGrid.EditableGridProps} props
 */
export default function EditableGrid(props) {
	const {gridState, setGridState} = props.gridStateProps;
	const [dragging, setDragging] = useState(null);
	const gridItems = getAllGridItems(gridState);

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
					key={item.toString()}
					index={i}
					item={item}
					gridProps={{...props}}
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
