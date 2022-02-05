import {useAuth} from "../auth/authContext";
import {makeCssUrl} from "../common/utils";
import useFullUserProfile from "../ProfilePage/useFullUserProfile";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import Offer from "./Offer";
import OfferModal from "./OfferModal";
import Search from "../Search/Search";
import Modal from "react-modal";
import {useState} from "react";
import {
	createOffer,
	fetchSentOffers,
	fetchReceivedOffers,
	getFullProfileById,
	updateOfferStatus,
} from "../api/api";
import {useResource} from "../utils/hooks";

export default function OffersView() {
	const [userName, setUserName] = useState();
	const [userId, setUserId] = useState();
	const [itemName, setItemName] = useState();
	const [itemPrice, setItemPrice] = useState();
	const [showOfferCreationModal, setShowOfferCreationModal] = useState(false);
	const [showOfferModal, setShowOfferModal] = useState(false);
	const [offerToShow, setOfferToShow] = useState(false);
	const [userToShow, setUserToShow] = useState();

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
		parsedBgUrl = makeCssUrl(loggedInUser.backgroundBase64 ?? defaultBackground);
	}

	const sentOffers = sentOfferFetch.status === "success" ? sentOfferFetch.value : [];
	const receivedOffers = receivedOfferFetch.status === "success" ? receivedOfferFetch.value : [];

	function updateSelectedUser(user) {
		setUserName(user.firstName + " " + user.lastName);
		setUserId(user.id);
	}

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

	async function inspectOffer(offer) {
		if (!offer) {
			return;
		}

		const idToFetch = loggedInUser.id == offer.toUserId ? offer.fromUserId : offer.toUserId;

		const userToShow = await getFullProfileById(idToFetch);

		console.log(userToShow);
		if (!userToShow) {
			console.log("Not found");
			return;
		}

		setOfferToShow(offer);
		setUserToShow(userToShow);
		setShowOfferModal(true);
	}

	function rejectOffer(id) {
		updateOfferStatus(id, "rejected");
		sentOffers.forEach(function (value) {
			if (value.id == id) {
				value.status = "rejected";
			}
		});
		receivedOffers.forEach(function (value) {
			if (value.id == id) {
				value.status = "rejected";
			}
		});
	}

	function acceptOffer(id) {
		updateOfferStatus(id, "accepted");
		sentOffers.forEach(function (value) {
			if (value.id == id) {
				value.status = "accepted";
			}
		});
		receivedOffers.forEach(function (value) {
			if (value.id == id) {
				value.status = "accepted";
			}
		});
	}

	const statusToValueMap = {
		accepted: 3,
		pending: 2,
		rejected: 1,
	};
	function compare(a, b) {
		const a_val = statusToValueMap[a.status];
		const b_val = statusToValueMap[b.status];
		if (a_val < b_val) {
			return 1;
		}
		if (a_val > b_val) {
			return -1;
		}
		return 0;
	}

	receivedOffers.sort(compare);
	sentOffers.sort(compare);

	return (
		<div
			id="offers-page-container"
			className="flex flex-col items-center h-screen w-screen"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full flex flex-col sm:w-10/12 p-8 pt-4 mt-8 gap-x-8 mb-8 h-full text-black display justify-end"
				style={{backgroundColor: "white", maxWidth: "970px"}}
			>
				<div className="w-full flex flex-col justify-self-end  pt-2">
					<div className="flex flex-row h-full justify-between align-center w-full">
						<h1 className="text-4xl">Offers</h1>
						<button
							className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold rounded justify-self-end"
							style={{width: "130px", height: "35px"}}
							onClick={() => setShowOfferCreationModal(true)}
						>
							New +
						</button>
					</div>
					<div className="flex flex-row h-full justify-start align-center w-1/2 pr-5 mt-4">
						<p className="text-lg mr-2">New Offers: 2</p>
						<p className="text-lg ml-2">
							Active Offers: {sentOffers.length + receivedOffers.length}
						</p>
					</div>
					<div className="w-1/2 flex flex-row h-full justify-end align-center">
						<div className="flex flex-row w-2/3 justify-center"></div>
					</div>
				</div>
				<div className="w-full flex flex-row justify-self-end flex-1 mt-4">
					<div className="w-1/2 flex flex-col h-full mr-2">
						<p className="text-xl mt-4 mb-2">Sent offers:</p>
						<div className="flex flex-col bg-gray-700 p-4 rounded overflow-auto h-full">
							{sentOffers.map((offer) => (
								<Offer key={offer.id} offer={offer} click={inspectOffer} />
							))}
							<h3 className={"text-white " + noOffersSent}>No offers sent yet!</h3>
						</div>
					</div>
					<div className="w-1/2 flex flex-col h-2 ml-2 h-full">
						<p className="text-xl mt-4 mb-2">Received offers:</p>
						<div className="flex flex-col bg-gray-700 p-4 rounded overflow-auto h-full">
							{receivedOffers.map((offer) => (
								<Offer key={offer.id} offer={offer} click={inspectOffer} />
							))}
							<h3 className={"text-white " + noOffersReceived}>No offers received yet!</h3>
						</div>
					</div>
				</div>
				<Modal
					id="offer-modal"
					isOpen={showOfferCreationModal}
					contentLabel="offer-modal"
					ariaHideApp={false}
					style={{
						overlay: {display: "flex", justifyContent: "center"},
						content: {
							flex: "1",
							maxWidth: "600px",
							height: "470px",
							position: "relative",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						},
					}}
				>
					<h1 className="text-3xl">Create a new offer:</h1>
					<div className="flex-1 w-full">
						<div className="flex flex-col w-full mt-10 p-4">
							<div className="flex flex-row justify-center">
								<div className="flex flex-col w-2/4 pl-2">
									<label>Search:</label>
									<Search
										onClick={updateSelectedUser}
										position={{x: window.innerWidth / 2 - 240, y: 220}}
									/>
								</div>
								<div className="flex flex-col w-2/4 self-end pl-4">
									<label>User seleceted:</label>
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
							<div className="flex flex-row mt-6 justify-center">
								<div className="flex flex-col w-2/4 pl-2">
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
								<div className="w-2/4 flex flex-col self-end align-items-end pl-4">
									<label className="self-start">Item price:</label>
									<input
										id="price-input"
										className="rounded border-gray-300 border bg-transparent p-2 "
										type="text"
										value={itemPrice}
										style={{maxWidth: "228px"}}
										onChange={(event) => setItemPrice(event.target.value)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="w-full flex justify-center">
						<div className="flex flex-col w-1/2 pr-8">
							<button
								className="w-32 h-8 rounded min-h-40 text-white bg-green-500 hover:bg-green-600 font-bold self-end"
								type="submit"
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
						<div className="flex flex-col w-1/2 pl-4">
							<button
								className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
								onClick={() => setShowOfferCreationModal(false)}
							>
								Cancel
							</button>
						</div>
					</div>
				</Modal>
				<OfferModal
					control={{showOfferModal: showOfferModal, setShowOfferModal: setShowOfferModal}}
					offer={offerToShow}
					user={loggedInUser}
					externalUser={userToShow}
					reject={rejectOffer}
					accept={acceptOffer}
				/>
			</div>
		</div>
	);
}
