export default function OffersView({offer}) {
	const statusToGradientMap = {
		accepted: "bg-gradient-to-r from-green-400 to-green-500",
		pending: "bg-gradient-to-r from-yellow-400 to-yellow-500",
		rejected: "bg-gradient-to-r from-red-400 to-red-500",
	};
	console.log(statusToGradientMap[offer.status]);
	return (
		<div
			className={
				"flex flex-row justify-between pl-2 pr-2 rounded mt-1 mb-1 " + statusToGradientMap[offer.status]
			}
		>
			<div className="flex flex-row w-2/4">
				<div className="flex flex-row p-2 w-2/3">
					<p>{offer.productName}</p>
				</div>
				<div className="flex flex-row p-2 w-1/3">
					<p>{offer.productPrice + "€"}</p>
				</div>
			</div>
			<div className="flex flex-row p-2 justify-self-end">
				<p>{offer.status}</p>
			</div>
		</div>
	);
}