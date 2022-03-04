import Box from "../Box";
import Offer from "../OffersPage/Offer";

function History() {
	const historyLists = [
		{
			id: 0,
			productName: "Bicycle",
			productPrice: 70,
			status: "accepted",
		},
		{
			id: 1,
			productName: "Car Tires",
			productPrice: 150,
			status: "accepted",
		},
		{
			id: 2,
			productName: "Skates",
			productPrice: 60,
			status: "accepted",
		},
		{
			id: 3,
			productName: "Helmet",
			productPrice: 55,
			status: "accepted",
		},
		{
			id: 4,
			productName: "Snowboard",
			productPrice: 200,
			status: "accepted",
		},
		{
			id: 5,
			productName: "Used Laptop",
			productPrice: 80,
			status: "accepted",
		},
	];

	const listAll = historyLists.map((item) => (
		<Offer
			className="mt-4"
			key={item.id}
			offer={item}
			click={() => (window.location.href = "/")}
		></Offer>
	));

	return <div className="w-full">{listAll}</div>;
}

export default function SellingHistory() {
	return (
		<Box title="Selling history">
			<div className="w-full pt-1">
				<History />
			</div>
		</Box>
	);
}
