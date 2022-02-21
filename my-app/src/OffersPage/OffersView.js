import {useAuth} from "../auth/authContext";
import {makeCssUrl} from "../common/utils";
import useFullUserProfile from "../ProfilePage/useFullUserProfile";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import Offer from "./Offer";
import OfferModal from "./OfferModal";
import Search from "../Search/Search";
import {useState} from "react";
import BasicInfo from "../ProfilePage/BasicInfo";
import {Tab, Tabs, TabList, TabPanel} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import {
	createOffer,
	fetchSentOffers,
	fetchReceivedOffers,
	getFullProfileById,
	updateOfferStatus,
	getUserById,
} from "../api/api";
import {useResource} from "../utils/hooks";
import {useParams} from "react-router-dom";

export default function OffersView() {
	/** @type {string | undefined | null} */
	const defaultValue = undefined;
	const [userName, setUserName] = useState(defaultValue);
	const [userId, setUserId] = useState(defaultValue);
	const [itemName, setItemName] = useState(defaultValue);
	const [itemPrice, setItemPrice] = useState(defaultValue);
	const [showOfferModal, setShowOfferModal] = useState(false);
	const [offerToShow, setOfferToShow] = useState(false);
	const [userToShow, setUserToShow] = useState();
	const [userToOffer, setUserToOffer] = useState(/** @type {number | undefined} */ undefined);
	const [tabIndex, setTabIndex] = useState(0);
	const params = useParams();

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

	const urlId = Number(params.id ?? -1);

	if (urlId >= 0 && userToOffer != urlId) {
		const urlUser = getUserById(urlId);
		setUserToOffer(urlId);
		setTabIndex(2);
		updateSelectedUser(urlUser);
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

		setTabIndex(0);

		return true;
	}

	function parseProfileUser() {
		let avatar = loggedInUser.avatarBase64;
		if (!loggedInUser.premium || !avatar) {
			avatar =
				"https://eu.ui-avatars.com/api/?name=" +
				loggedInUser.firstName.charAt(0) +
				"+" +
				loggedInUser.lastName.charAt(0);
		}
		return {
			id: loggedInUser.id,
			avatarUrl: avatar,
			name: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
			bday: "22.10.1987",
			city: "Turku",
			followers: loggedInUser.followers,
			premium: loggedInUser.premium,
			achievements: [
				//Note: The description could eventually be hardcoded to the icon type
				//Doesn't make sense currently since we only have two icons
				{
					text: "Seller No. 1",
					description: "This trophy was awarded to the number 1 seller of the month!",
					iconType: "trophy",
				},
				{
					text: "Top 100",
					description: "This trophy was awarded to the top 100 sellers this month!",
					iconType: "trophy",
				},
				{
					text: "Seal Approved",
					description: "This seller is recognized as trustworthy by the Seal Team!",
					iconType: "trophy",
				},
				{
					text: "Trusted",
					description: "This seller has made +20 completed sales!",
					iconType: "trophy",
				},
				{
					text: "Ecological",
					description: "This seller has saved +20 products from the trashcan!",
					iconType: "trophy",
				},
			],
		};
	}

	async function inspectOffer(offer) {
		if (!offer) {
			return;
		}

		const idToFetch = loggedInUser.id == offer.toUserId ? offer.fromUserId : offer.toUserId;

		const userToShow = await getFullProfileById(idToFetch);

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
			className="flex flex-col items-center min-h-screen w-screen"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full flex flex-col sm:w-10/12 p-8 pt-4 mt-8 gap-x-8 mb-8 h-full display justify-end"
				style={{opacity: 0.9, backdropFilter: "brightness(1.5) blur(4px)", maxWidth: "970px"}}
			>
				<div className="w-full flex flex-col justify-self-end  pt-2">
					<div className="flex flex-row h-full justify-start align-center w-full pr-5 mt-4">
						<BasicInfo user={parseProfileUser()} />
					</div>
					<div className="w-1/2 flex flex-row h-full justify-end align-center">
						<div className="flex flex-row w-2/3 justify-center"></div>
					</div>
				</div>
				<Tabs
					className="w-full flex flex-col justify-self-end flex-1 mt-4 text-black "
					selectedIndex={tabIndex}
					onSelect={(index) => setTabIndex(index)}
				>
					<TabList style={{marginBottom: "0px"}}>
						<Tab>Sent offers</Tab>
						<Tab>Received offers</Tab>
						<Tab>New Offer</Tab>
					</TabList>
					<TabPanel className="w-full">
						<div className="flex flex-col h-full mr-2">
							<div className="flex flex-col bg-gray-700 p-4 rounded overflow-auto h-full">
								{sentOffers.map((offer) => (
									<Offer key={offer.id} offer={offer} click={inspectOffer} />
								))}
								<h3 className={"text-white " + noOffersSent}>No offers sent yet!</h3>
							</div>
						</div>
					</TabPanel>
					<TabPanel className="w-full">
						<div className="flex flex-col h-2">
							<div className="flex flex-col bg-gray-700 p-4 rounded overflow-auto h-full">
								{receivedOffers.map((offer) => (
									<Offer key={offer.id} offer={offer} click={inspectOffer} />
								))}
								<h3 className={"text-white " + noOffersReceived}>No offers received yet!</h3>
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div className="bg-gray-700  rounded flex-1">
							<div
								className="flex flex-col w-full align-center justify-center"
								style={{minHeight: "350px"}}
							>
								<h1 className="text-4xl text-white ml-4">Create: </h1>
								<div className="flex flex-col w-full p-4">
									<div className="flex flex-row justify-center">
										<div className="flex flex-col w-2/4 pl-2">
											<label className="text-white">Search:</label>
											<Search onClick={updateSelectedUser} inputColor="white" />
										</div>
										<div className="flex flex-col w-2/4 self-end pl-4">
											<label className="text-white">User seleceted:</label>
											<input
												id="selected-user"
												className="rounded border-gray-300 border bg-white p-2"
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
											<label htmlFor="selected-user" className="text-white">
												Item name:
											</label>
											<input
												id="selected-user"
												className="rounded border-gray-300 border bg-white p-2"
												type="text"
												value={itemName}
												style={{maxWidth: "228px"}}
												onChange={(event) => setItemName(event.target.value)}
											/>
										</div>
										<div className="w-2/4 flex flex-col self-end align-items-end pl-4">
											<label className="self-start text-white">Item price:</label>
											<input
												id="price-input"
												className="rounded border-gray-300 border bg-white p-2 "
												type="text"
												value={itemPrice}
												style={{maxWidth: "228px"}}
												onChange={(event) => setItemPrice(event.target.value)}
											/>
										</div>
									</div>
								</div>
								<button
									className="w-32 h-8 rounded min-h-40 text-white bg-green-500 hover:bg-green-600 font-bold ml-6 mt-4"
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
						</div>
					</TabPanel>
				</Tabs>
			</div>
			<OfferModal
				control={{showOfferModal: showOfferModal, setShowOfferModal: setShowOfferModal}}
				offer={offerToShow}
				user={loggedInUser}
				externalUser={userToShow}
				reject={rejectOffer}
				accept={acceptOffer}
			/>
		</div>
	);
}
