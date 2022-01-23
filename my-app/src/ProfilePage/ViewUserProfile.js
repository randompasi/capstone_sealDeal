import {useParams} from "react-router-dom";
import {useResource} from "../utils/hooks";
import ProfilePage from "./ProfilePageInfo";
import * as api from "../api/api";
import {gridDefaultState} from "../EditableGrid/editableGridUtils";
import {DndProvider} from "react-dnd";
import {HTML5Backend as DnDHTML5Backend} from "react-dnd-html5-backend";

export default function ViewUserProfile() {
	const params = useParams();
	const userId = Number(params.id);
	const gridResource = useResource(async () => {
		const [user] = await api.get("users", {
			id: api.matchers.eq(userId),
			select: "grid:profileGrids(id,rows)",
		});
		return user.grid;
	});

	if (gridResource.status !== "success") {
		return null;
	}

	const gridRows = gridResource.value?.rows || [];

	/** @type {EditableGrid.GridStateProps} */
	const gridStateProps = {
		gridState: gridRows.length > 0 ? gridRows : gridDefaultState,
		setGridState: () => {},
	};

	return (
		<DndProvider backend={DnDHTML5Backend}>
			<div className="h-screen w-full">
				<ProfilePage user={{id: userId}} gridStateProps={gridStateProps} />
			</div>
		</DndProvider>
	);
}
