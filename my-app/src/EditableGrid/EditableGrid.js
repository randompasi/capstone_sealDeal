import {clamp} from "lodash";
import uniq from "lodash/uniq";
import {useCallback, useRef, useState} from "react";
import {impossibleCase} from "../common/utils";
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
 * @param {string} direction
 */
function getMouseMovedRelativeAmount(event, direction) {
	switch (direction) {
		case "left":
			return event.movementX * -1;
		case "right":
			return event.movementX;
		case "top":
			return event.movementY * -1;
		case "bottom":
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
	const mouseDown = useCallback((event) => {
		event.preventDefault();
		if (dragging) {
			return;
		}
		dragging = true;
		let mouseMoved = 0;

		/** @type {HTMLDivElement} */
		// @ts-ignore
		const borderElem = event.target;
		const direction = borderElem.dataset?.direction;
		if (!direction) {
			console.warn("Cannot find direction from dragged element");
			return;
		}
		props.setDragging(props.item);

		const mouseMove = (/** @type {MouseEvent} */ event) => {
			mouseMoved = clamp(
				Math.round(mouseMoved + getMouseMovedRelativeAmount(event, direction)),
				0,
				400
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
		};

		document.body.addEventListener("mouseup", mouseUp);
		document.body.addEventListener("mousemove", mouseMove);
	}, []);

	const draggingClassName =
		props.dragging && props.dragging !== props.item ? "seal-editable-grid-resize-target" : "";

	const style = {
		gridArea: props.item,
	};

	return (
		<div className={`w-full h-full relative ${draggingClassName}`} style={style}>
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

	/** @type {Record<string, string>} */
	const style = {
		gridTemplateAreas: parseGridTemplateAreas(gridState),
	};

	return (
		<div className="grid gap-4 w-full" style={style}>
			{gridItems.map((item) => (
				<EditableGridItem
					key={item}
					item={item}
					profilePageProps={profilePageProps}
					dragging={dragging}
					setDragging={setDragging}
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
