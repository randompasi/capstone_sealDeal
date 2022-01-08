import {uniqueId, uniq} from "lodash";
import {useCallback, useState} from "react";

/**
 * @param {EditableGrid.GridModel} gridState
 * @returns {EditableGrid.GridIdentifier[]}
 */
export function getAllGridItems(gridState) {
	return uniq(gridState.flatMap((_) => [_.a, _.b]))
		.map((_) => (typeof _ === "string" ? _ : null))
		.filter(Boolean);
}

/**
 * @implements {EditableGrid.EmptySlot}
 */
export class EmptySlot {
	constructor() {
		/** @type {"empty slot"} */
		this.type = "empty slot";
		this.uniqueId = uniqueId("grid-empty-slot");
	}
	toString() {
		return `[EmptySlot ${this.uniqueId}]`;
	}
}

/**
 * @param {EditableGrid.GridIdentifier | EditableGrid.EmptySlot} val
 * @returns {EditableGrid.GridIdentifier | null}
 */
export function emptySlotToNull(val) {
	return typeof val === "string" ? val : null;
}

/**
 * @param {EditableGrid.GridIdentifier | null} val
 * @returns {EditableGrid.GridIdentifier | EditableGrid.EmptySlot}
 */
export function nullToEmptySlot(val) {
	return val === null ? new EmptySlot() : val;
}

const mapRowNullsToEmptySlots = (row) => ({
	a: nullToEmptySlot(row.a),
	b: nullToEmptySlot(row.b),
});

/**
 * @param {EditableGrid.GridModel} defaultValue
 * @returns {EditableGrid.GridStateProps}
 */
export function useGridState(defaultValue) {
	const [gridState, setGridStateRaw] = useState(() => defaultValue.map(mapRowNullsToEmptySlots));
	const setGridState = useCallback(
		(newVal) => {
			setGridStateRaw(newVal.map(mapRowNullsToEmptySlots));
		},
		[setGridStateRaw]
	);
	// We store empty slots as null in DB, map them to the EmptySlot class
	return {gridState, setGridState};
}

export const GRID_CARD_DND_TYPE = "GridComponentCard";

/**
 * @param {EditableGrid.GridRow["a"] | null} expected
 * @param {EditableGrid.GridRow["a"] | null} other
 */
function gridItemsEqual(expected, other) {
	if (expected === other) return true;
	if (typeof expected === "object" && expected.type === "empty slot") {
		// If the expected value is null, accept both null and EmptySlot items
		return (
			typeof other === "object" &&
			other.type === "empty slot" &&
			expected.uniqueId === other.uniqueId
		);
	}
	return false;
}
/**
 * @param {EditableGrid.GridModel} gridState
 * @param {EditableGrid.GridRow["a"] | null} itemToRemove
 * @param {EditableGrid.GridRow["a"] | null} itemToAdd
 * @returns {EditableGrid.GridModel}
 */
export function replaceGridStateItems(gridState, itemToRemove, itemToAdd) {
	return gridState.map((_) => ({
		a: _.a === itemToRemove ? itemToAdd : _.a,
		b: _.b === itemToRemove ? itemToAdd : _.b,
	}));
}
