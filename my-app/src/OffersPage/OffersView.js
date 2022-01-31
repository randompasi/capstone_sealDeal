import {useAuth} from "../auth/authContext";
import {makeCssUrl} from "../common/utils";
import useFullUserProfile from "../ProfilePage/useFullUserProfile";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import Offer from "./Offer";
import Search from "../Search/Search";
import {useState} from "react";
import {createOffer, fetchSentOffers, fetchReceivedOffers, updateOfferStatus} from "../api/api";
import {useResource} from "../utils/hooks";

export default function OffersView() {
	const [userName, setUserName] = useState();
	const [userId, setUserId] = useState();
	const [itemName, setItemName] = useState();
	const [itemPrice, setItemPrice] = useState();

	const authContext = useAuth();
	const sentOfferFetch = useResource(async () => fetchSentOffers(authContext.user.id));
	const receivedOfferFetch = useResource(async () => fetchReceivedOffers(authContext.user.id));

	const fetchedProfile = useFullUserProfile(authContext.user.id);
	if (fetchedProfile.status !== "success") {
		return null;
	}
	const loggedInUser = fetchedProfile.value;

	let parsedBgUrl = makeCssUrl(defaultBackground);
	if (loggedInUser.premium) {
		parsedBgUrl = makeCssUrl(loggedInUser.backgroundBase64);
	}

	/*const mockupOffers = [
		{id: 1, productName: "Car tires", productPrice: 299.99, status: "accepted"},
		{id: 2, productName: "Snowboard", productPrice: 399.99, status: "accepted"},
		{id: 3, productName: "Graphics card", productPrice: 499.99, status: "pending"},
		{id: 4, productName: "Macbook Air", productPrice: 599.99, status: "rejected"},
	];*/

	const sentOffers = sentOfferFetch.status === "success" ? sentOfferFetch.value : [];
	const receivedOffers = receivedOfferFetch.status === "success" ? receivedOfferFetch.value : [];

	function updateSelectedUser(user) {
		setUserName(user.firstName + " " + user.lastName);
		setUserId(user.id);
		console.log(userName + " - " + userId);
	}

	console.log(sentOffers.length);
	const noOffersReceived = receivedOffers.length ? "hidden" : "";
	const noOffersSent = sentOffers.length ? "hidden" : "";

	function sendOffer() {
		if (
			!itemName ||
			!itemPrice ||
			!userId ||
			!loggedInUser.id ||
			!Number.isInteger(parseInt(itemPrice))
		) {
			return false;
		}
		const parsedOffer = {
			toUserId: userId,
			fromUserId: loggedInUser.id,
			productName: itemName,
			productPrice: itemPrice,
			status: "pending",
		};

		console.log(parsedOffer);

		createOffer(parsedOffer);

		let index = -1;
		sentOffers.forEach(function (value, i) {
			if (value.status !== "accepted" && i === -1) {
				index = i;
			}
		});
		sentOffers.splice(index, 0, parsedOffer);

		return true;
	}

	return (
		<div
			id="offers-page-container"
			className="flex flex-col items-center h-screen w-screen"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full sm:w-10/12 p-8 pt-4 mt-8 gap-x-8 mb-8 h-full text-black"
				style={{backgroundColor: "white", maxWidth: "970px"}}
			>
				<p className="text-xl mt-4 mb-2">Sent offers:</p>
				<div className="flex flex-col bg-gray-700 p-4 rounded h-1/3 overflow-auto">
					{sentOffers.map((offer) => (
						<Offer key={offer.id} offer={offer} />
					))}
					<h3 className={"text-white " + noOffersSent}>No offers sent yet!</h3>
				</div>

				<p className="text-xl mt-4 mb-2">Received offers:</p>
				<div className="flex flex-col bg-gray-700 p-4 rounded h-1/3 overflow-auto">
					{receivedOffers.map((offer) => (
						<Offer className="mt-2 mb-2" key={offer.id} offer={offer} />
					))}
					<h3 className={"text-white " + noOffersReceived}>No offers received yet!</h3>
				</div>

				<div className="flex flex-col h-1/3 mt-10">
					<div className="flex flex-row">
						<div className="flex flex-col w-1/4">
							<p className="text-xl mt-4 mb-2">Create a new offer:</p>
							<Search onClick={updateSelectedUser} />
						</div>
						<div className="flex flex-col w-1/4 justify-end ml-4">
							<input
								id="selected-user"
								className="rounded border-gray-300 border bg-transparent p-2"
								type="text"
								value={userName}
								placeholder="-"
								disabled
								style={{maxWidth: "228px"}}
							/>
						</div>
					</div>
					<div className="flex flex-row mt-6">
						<div className="flex flex-col w-1/4">
							<label htmlFor="selected-user">Item name:</label>
							<input
								id="selected-user"
								className="rounded border-gray-300 border bg-transparent p-2"
								type="text"
								value={itemName}
								style={{maxWidth: "228px"}}
								onChange={(event) => setItemName(event.target.value)}
							/>
						</div>
						<div className="w-1/4 flex flex-col ml-4 justify-end">
							<label htmlFor="price-input">Item price:</label>
							<input
								id="price-input"
								className="rounded border-gray-300 border bg-transparent p-2 "
								type="text"
								value={itemPrice}
								style={{maxWidth: "228px"}}
								onChange={(event) => setItemPrice(event.target.value)}
							/>
						</div>
						<div className="w-1/4 flex flex-col justify-end ml-4">
							<button
								className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
								type="submit"
								style={{maxWidth: "160px"}}
								onClick={() => {
									const result = sendOffer();
									if (result) {
										alert("Offer sent successfully!");
										setUserName("");
										setUserId(null);
										setItemName("");
										setItemPrice("");
									} else {
										alert("Failure, invalid or missing values! :(");
									}
								}}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
