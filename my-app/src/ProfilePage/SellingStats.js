import {get, matchers} from "../api/api";
import Box from "../Box";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import {useResource} from "../utils/hooks";
import {Line} from "react-chartjs-2";
import {keyBy, uniq} from "lodash";
import * as colors from "../common/colors";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function SellingStats(props) {
	const offerStatsResource = useResource(async () => {
		const offerStats = await get("offersStats", {
			toUserId: matchers.eq(props.user.id),
		});

		// The week number is in format YYYY-WW, just take the week part
		const weeks = uniq(offerStats.map(({week}) => week));
		const labels = weeks.map((week, i, arr) => {
			if (i === arr.length - 1) {
				return "This week";
			}
			return "Week " + week.replace(/^[0-9]{4}-0?/, "");
		});
		const grouped = keyBy(offerStats, (stat) => `${stat.week}_${stat.status}`);
		const getData = (status, propGetter) =>
			weeks.map((week) => {
				const item = grouped[`${week}_${status}`];
				return (item && propGetter(item)) || 0;
			});
		const datasetColor = (color) => ({
			backgroundColor: colors.hexToRgba(color, 0.2),
			borderColor: color,
			fill: "origin",
		});

		const sellsData = getData("accepted", (_) => _.totalOffers);
		const earningsData = getData("accepted", (_) => _.totalPrice);

		const data = {
			labels,
			datasets: [
				{
					label: "Sold items",
					data: sellsData,
					...datasetColor(colors.BLUE),
				},
				{
					label: "Earnings",
					data: earningsData,
					yAxisID: "yRight",
					...datasetColor(colors.GREEN),
				},
				{
					label: "Rejections",
					data: getData("rejected", (_) => _.totalOffers),
					...datasetColor(colors.RED),
				},
				{
					label: "Predicted",
					yAxisID: "yRight",
					data: getData("pending", (_) => _.totalPrice).map(
						(_, index) => _ + earningsData[index] || null
					),
					...datasetColor(colors.YELLOW),
				},
			],
		};
		return data;
	});
	if (!props.user.premium || offerStatsResource.status !== "success") {
		return null;
	}

	/** @type {any} */
	const chartOptions = {
		responsive: true,
		bezierCurve: true,
		color: colors.WHITE,
		plugins: {
			legend: {
				position: "top",
			},
		},
		scales: {
			y: {
				type: "linear",
				display: true,
				position: "left",
				ticks: {
					color: colors.WHITE,
				},
			},
			yRight: {
				title: {
					display: true,
					text: "Earnings €",
					color: colors.WHITE,
				},
				ticks: {
					color: colors.WHITE,
				},
				color: colors.WHITE,
				type: "linear",
				display: true,
				position: "right",

				// grid line settings
				grid: {
					drawOnChartArea: false, // only want the grid lines for one axis to show up
				},
			},
			x: {
				ticks: {
					color: colors.WHITE,
				},
			},
		},
	};

	return (
		<Box title="Stats">
			<div className="flex flex-col gap-4">
				<Line options={chartOptions} data={offerStatsResource.value} />
			</div>
		</Box>
	);
}
