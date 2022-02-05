import Box from "../Box";

function History(props) {
	console.log(props);
	const historyLists = [
		{
			id: 0,
			content: "Bicycle",
			date: "22.11.2021",
			button: "User Review",
		},
		{
			id: 1,
			content: "Car Tires",
			date: "12.11.2021",
			button: "User Review",
		},
		{
			id: 2,
			content: "Skates",
			date: "09.10.2021",
			button: "User Review",
		},
		{
			id: 3,
			content: "Helmet",
			date: "08.10.2021",
			button: "User Review",
		},
	];

	const listAll = historyLists.map((historyList, index) => (
		<ul key={index}>
			<li key={historyList.id} className="flex flex-col justify-between mb-2">
				<h1>{historyList.content + " - " + historyList.date}</h1>
				<a className="underline underline-offset-1" href={""}>
					{historyList.button}
				</a>
			</li>
		</ul>
	));

	return <div className="w-full">{listAll}</div>;
}

export default function SellingHistory() {
	return (
		<Box title="Selling history">
			<div className="w-full">
				<History />
			</div>
		</Box>
	);
}
