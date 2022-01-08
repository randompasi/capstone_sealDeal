import {uniqueId, uniq} from "lodash";

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
// @ts-ignore
export class EmptySlot {
	constructor() {
		this.type = "empty slot";
		this.unqiueId = uniqueId("grid-empty-slot");
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
	// @ts-ignore
	return val === null ? new EmptySlot() : val;
}
