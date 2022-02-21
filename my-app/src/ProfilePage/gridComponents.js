import Achievements from "../ProfilePage/Achievements";
import BasicInfo from "../ProfilePage/BasicInfo";
import EnvironmentalSavings from "../ProfilePage/EnvironmentalSavings";
import Reviews from "./Reviews";
import SellingHistory from "./SellingHistory";
import SellingStats from "./SellingStats";

/**
 * @type {EditableGrid.EditableGridProps["components"]}
 */
const gridComponents = {
	Achievements,
	BasicInfo,
	EnvironmentalSavings,
	Reviews,
	SellingHistory,
	SellingStats,
};

export default gridComponents;
