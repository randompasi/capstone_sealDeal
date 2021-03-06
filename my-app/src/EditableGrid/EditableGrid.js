import {findIndex, findLastIndex, times} from "lodash";
import {useCallback} from "react";
import {useDrop} from "react-dnd";
import "./EditableGrid.css";
import {EditableGridItem} from "./EditableGridItem";
import {
	cloneGridState,
	EmptySlot,
	getAllGridItems,
	GRID_CARD_DND_TYPE,
	isEmptyRow,
	isEmptySlot,
	replaceGridStateItems,
} from "./editableGridUtils";

function collectDropState(monitor) {
	return {
		isDragging: monitor.canDrop(),
	};
}

/**
 * @param {EditableGrid.EditableGridProps} props
 */
export default function EditableGrid(props) {
	// eslint-disable-next-line prefer-const
	let {gridState, setGridState} = props.gridStateProps;
	const gridItems = getAllGridItems(gridState);

	if (!props.user.premium) {
		// Remove Stats component from non-premium users, it's a premium feature
		gridState = replaceGridStateItems(gridState, "SellingStats", new EmptySlot()).filter(
			(_) => !isEmptyRow(_)
		);
	}

	const resize = useCallback(makeResizeCallback(gridState, setGridState), [
		gridState,
		setGridState,
	]);

	const [dragState] = useDrop(() => ({
		accept: GRID_CARD_DND_TYPE,
		collect: collectDropState,
	}));

	/** @type {Record<string, string>} */
	const style = {
		gridTemplateAreas: parseGridTemplateAreas(gridState),
		gridTemplateRows: !dragState.isDragging ? parseGridRowsStyle(gridState) : undefined,
	};

	return (
		<div className="w-full seal-editable-grid" style={style}>
			{gridItems.map((item, i) => (
				<EditableGridItem
					key={item.toString()}
					index={i}
					item={item}
					gridProps={{...props}}
					resize={resize}
					canEdit={props.canEdit}
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
	const renderSlot = (slot) => slot.toString();
	return gridState.map((state) => `"${renderSlot(state.a)} ${renderSlot(state.b)}"`).join("\n");
}

/**
 * @param {EditableGrid.GridModel} gridState
 * @returns {string} CSS string that can be used for value to grid-rows rule
 */
function parseGridRowsStyle(gridState) {
	return gridState.map((row) => (isEmptyRow(row) ? "0px" : "minmax(100px, auto)")).join(" ");
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

	const newState = cloneGridState(gridState);

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
				const fullRow = !(isEmptySlot(newRow.a) || isEmptySlot(newRow.b));
				if (!fullRow && isEmptySlot(newRow.a) && !isEmptySlot(row.a)) {
					return {
						a: row.a,
						b: newRow.b,
					};
				}
				if (!fullRow && isEmptySlot(newRow.b) && !isEmptySlot(row.b)) {
					return {
						a: newRow.a,
						b: row.b,
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
