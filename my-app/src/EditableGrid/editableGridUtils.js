import {uniqueId, uniq} from "lodash";
import {useCallback, useState} from "react";
import {useResource} from "../utils/hooks";
import * as api from "../api/api";

/** @type {EditableGrid.GridModel} */
export const gridDefaultState = [
	{a: "BasicInfo", b: "Achievements"},
	{a: "Reviews", b: "SellingHistory"},
	{a: "SellingStats", b: "SellingStats"},
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
export function isEmptyRow(row) {
	return isEmptySlot(row.a) && isEmptySlot(row.b);
}

/**
 * @type {EditableGrid.MakeRowMapper}
 */
export const makeRowMapper = (fn) => (row) => ({
	a: fn(row.a),
	b: fn(row.b),
});

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
 * @param {EditableGrid.GridModel} gridState
 * @returns {EditableGrid.GridModel}
 */
export function cloneGridState(gridState) {
	return gridState.map((row) => ({
		a: row.a,
		b: row.b,
	}));
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

/**
 * @param {null | number} gridId
 * @param {any[]} [deps]
 * @returns {UtilityTypes.AsyncResourceState<{id: null | number, gridState: EditableGrid.GridStateProps}>}
 */
export function useProfileGridResource(gridId, deps) {
	const modifiableGridState = useGridState(gridDefaultState);
	const savedGridState = useResource(async () => {
		if (!gridId) {
			return null;
		}
		const [grid] = await api.get("profileGrids", {id: api.matchers.eq(gridId)});
		modifiableGridState.setGridState(grid.rows);
		return grid.id;
	}, [gridId, ...(deps || [])]);

	if (savedGridState.status !== "success") {
		return savedGridState;
	} else {
		return {
			status: "success",
			value: {
				id: savedGridState.value,
				gridState: modifiableGridState,
			},
		};
	}
}

export function saveGridItem(gridItem) {
	if (gridItem.id) {
		return api.patch("profileGrids", gridItem.id, gridItem);
	} else {
		return api.post("profileGrids", gridItem);
	}
}
