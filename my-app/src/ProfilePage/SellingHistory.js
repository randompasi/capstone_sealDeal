import Box from "../Box";

function History() {
	const historyLists = [
		{
			id: 0,
			content: "Bicycle",
			date: "22.10.2021",
			button: "User Review",
		},
		{
			id: 1,
			content: "Bicycle",
			date: "22.10.2021",
			button: "User Review",
		},
		{
			id: 2,
			content: "Bicycle",
			date: "22.10.2021",
			button: "User Review",
		},
		{
			id: 3,
			content: "Bicycle",
			date: "22.10.2021",
			button: "User Review",
		},
	];

	const listAll = historyLists.map((historyList) => (
		<li key={historyList.id}>
			{historyList.content}
			{historyList.date}
			<div>
				<a href={""}>
					{historyList.button}
				</a>
			</div>
		</li>
	));

	return (
		<div>
			<ul>{listAll}</ul>
		</div>
	);
}

export default function SellingHistory() {
	return (
		<Box className="my-5" title="Selling history">
			<div className="grid grid-cols-3 w-full">
				<History />
			</div>
		</Box>
	);
}
