import {uniqueId, uniq} from "lodash";
import {useCallback, useState} from "react";

/** @type {EditableGrid.GridModel} */
export const gridDefaultState = [
	{a: "BasicInfo", b: "Achievements"},
	{a: "EnvironmentalSavings", b: "EnvironmentalSavings"},
];

/**
 * @param {EditableGrid.GridModel} gridState
 * @returns {Array<EditableGrid.GridIdentifier | EditableGrid.EmptySlot>}
 */
export function getAllGridItems(gridState) {
	return uniq(gridState.flatMap((_) => [_.a, _.b]));
}

/**
 * @implements {EditableGrid.EmptySlot}
 */
export class EmptySlot {
	constructor() {
		/** @type {"empty slot"} */
		this.type = "empty slot";
		this.uniqueId = uniqueId("GridEmptySlot");
	}
	toString() {
		return `${this.uniqueId}`;
	}
}

/**
 * @param {EditableGrid.GridIdentifier | EditableGrid.EmptySlot} val
 * @returns {val is EditableGrid.EmptySlot | null}
 */
export function isEmptySlot(val) {
	return val === null || (typeof val === "object" && val.type === "empty slot");
}
/**
 * @param {EditableGrid.GridRow} row
 * @returns {boolean}
 */
function isEmptyRow(row) {
	return isEmptySlot(row.a) && isEmptySlot(row.b);
}

/**
 * @param {EditableGrid.GridIdentifier | EditableGrid.EmptySlot} val
 * @returns {EditableGrid.GridIdentifier | null}
 */
export function emptySlotToNull(val) {
	return isEmptySlot(val) ? null : val;
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
 * @param {EditableGrid.GridModel} gridState
 * @returns {EditableGrid.GridModel}
 */
function normalizeGridStateForUi(gridState) {
	const rows = gridState.filter((row) => !isEmptyRow(row));
	// Add one empty row above and one below so that new items can be dropped there
	return [{a: null, b: null}, ...rows, {a: null, b: null}].map(mapRowNullsToEmptySlots);
}

/**
 * @param {EditableGrid.GridModel} defaultValue
 * @returns {EditableGrid.GridStateProps}
 */
export function useGridState(defaultValue) {
	const [gridStateRaw, setGridStateRaw] = useState(() => normalizeGridStateForUi(defaultValue));
	const setGridState = useCallback(
		(newVal) => {
			setGridStateRaw(normalizeGridStateForUi(newVal));
		},
		[setGridStateRaw]
	);
	const gridState = normalizeGridStateForUi(gridStateRaw);
	// We store empty slots as null in DB, map them to the EmptySlot class
	return {gridState, setGridState};
}

export const GRID_CARD_DND_TYPE = "GridComponentCard";

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

/**
 * @param {EditableGrid.GridIdentifier | EditableGrid.EmptySlot | null} item
 * @param {EditableGrid.EditableGridProps} gridProps
 */
export function renderItemComponent(item, {components, ...profilePageProps}) {
	const Component = typeof item === "string" ? components[item] : null;
	if (!Component) {
		console.warn(`No component handler configured for ${item}`);
		return null;
	}
	return <Component {...profilePageProps} />;
}
