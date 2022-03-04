import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import Avatar from "../ProfilePage/Avatar";
import {FaRegHandshake, FaHandshakeSlash} from "react-icons/fa"; //react-icons.github.io/react-icons
import {ImCross} from "react-icons/im";
import {IconContext} from "react-icons/lib";
import CircleReview from "./CircleReview";
import {useState} from "react";
import {finishOfferReview, sendReview, patchUser} from "../api/api";
import {useAuth} from "../auth/authContext";

export default function OfferModal({onClose, offer, user, externalUser, reject, accept}) {
	const ReviewStates = {
		done: -1,
		seller: 1,
		friendliness: 2,
		delivery: 3,
		condition: 4,
		old: 5,
	};

	const defaultReviews = {
		friendliness: -1,
		delivery: -1,
		condition: -1,
	};

	const authContext = useAuth();

	const [reviewState, setReviewState] = useState(null);
	const [lastReview, setLastReview] = useState(null);
	const [collectedReviews, setCollectedReviews] = useState(null);
	const [reward, setReward] = useState(null);

	if (lastReview !== offer.id) {
		setLastReview(offer.id);
		setReviewState(null);
		setReward(null);
		setCollectedReviews(defaultReviews);
	}

	const statusToSettingsMap = {
		accepted: "green",
		pending: "#fbbf24",
		rejected: "red",
	};

	let avatar,
		parsedName,
		linkToId,
		exAvatar,
		exParsedName,
		exLinkToId = null;
	if (user) {
		avatar = user.avatarBase64;
		parsedName = user.firstName + " " + user.lastName;
		linkToId = user.id;
		if (!user.premium || !avatar) {
			avatar =
				"https://eu.ui-avatars.com/api/?name=" +
				user.firstName.charAt(0) +
				"+" +
				user.lastName.charAt(0);
		}
	}
	if (externalUser) {
		exAvatar = externalUser.avatarBase64;
		exParsedName = externalUser.firstName + " " + externalUser.lastName;
		exLinkToId = externalUser.id;
		if (!externalUser.premium || !exAvatar) {
			exAvatar =
				"https://eu.ui-avatars.com/api/?name=" +
				externalUser.firstName.charAt(0) +
				"+" +
				externalUser.lastName.charAt(0);
		}
	}

	let isSeller = false;
	const fromId = user.id;
	let toId = offer.fromUserId;
	if (user.id == offer.fromUserId) {
		isSeller = true;
		toId = offer.toUserId;
	}

	let showButtons = true;
	if (
		offer.status != "pending" ||
		(offer.fromUserId == linkToId && offer.fromUserId !== offer.toUserId)
	) {
		showButtons = false;
	}

	let showReview = false;
	if (offer.status == "accepted") {
		if (!offer.toReview && !isSeller) {
			showReview = true;
			if (reviewState == null) {
				setReviewState(ReviewStates.friendliness);
			}
		} else if (!offer.fromReview && isSeller) {
			showReview = true;
			if (reviewState == null) {
				setReviewState(ReviewStates.seller);
			}
		} else if (reviewState == null) {
			setReviewState(ReviewStates.old);
		}
	}

	function getStatusText() {
		if (offer.status == "pending" && showButtons) {
			return "Make a deal on '" + offer.productName + "' for " + offer.productPrice + "€ ?";
		} else if (offer.status == "pending") {
			return "Your offer for '" + offer.productName + "' - " + offer.productPrice + "€ is pending.";
		} else if (offer.status == "accepted") {
			return "You Sealed the Deal on '" + offer.productName + "' for " + offer.productPrice + "€ !";
		} else {
			return "This deal was rejected by the receiver :(";
		}
	}

	function getReviewStatusText() {
		const base = "Review the Deal: ";
		if (reviewState == ReviewStates.old || reviewState == ReviewStates.done) {
			return "Review done, Thank you for the feedback!";
		} else if (reviewState == ReviewStates.seller) {
			return base + "Customer friendliness";
		} else if (reviewState == ReviewStates.friendliness) {
			return base + "Friendliness";
		} else if (reviewState == ReviewStates.delivery) {
			return base + "Delivery";
		} else if (reviewState == ReviewStates.condition) {
			return base + "Condition";
		}
	}

	function getHandshakeIcon() {
		if (offer.status == "rejected") {
			return <FaHandshakeSlash></FaHandshakeSlash>;
		}
		return <FaRegHandshake></FaRegHandshake>;
	}

	async function handleReviewClick(review) {
		if (reviewState == ReviewStates.friendliness) {
			collectedReviews.friendliness = review;
			setReviewState(ReviewStates.delivery);
		} else if (reviewState == ReviewStates.delivery) {
			collectedReviews.delivery = review;
			setReviewState(ReviewStates.condition);
		} else if (reviewState == ReviewStates.condition || reviewState == ReviewStates.seller) {
			setReviewState(ReviewStates.done);
			collectedReviews.condition = review;
			const pointsToReward = Math.floor(Math.random() * (250 - 50 + 1) + 50);
			setReward(pointsToReward);
			await finishOfferReview(offer.id, isSeller);
			await patchUser(authContext, {
				points: user.points + pointsToReward,
			});
			user.points = user.points + pointsToReward;

			if (isSeller) {
				offer.fromReview = true;
			} else {
				offer.toReview = true;
			}

			if (reviewState != ReviewStates.seller) {
				sendReview(fromId, toId, collectedReviews.friendliness, "friendliness");
				sendReview(fromId, toId, collectedReviews.delivery, "delivery");
				sendReview(fromId, toId, collectedReviews.condition, "condition");
			} else {
				sendReview(fromId, toId, collectedReviews.condition, "friendliness");
			}
		}
	}

	function getReviewParital() {
		if (showReview && reviewState != ReviewStates.done) {
			return <CircleReview click={handleReviewClick} />;
		} else if (reviewState == ReviewStates.old) {
			return <p className="mt-4">Review done, Thank you for the Feedback!</p>;
		} else if (reviewState == ReviewStates.done) {
			return (
				<p className="mt-4">
					You were rewarded <span className="underline">{reward} Seal-points</span> for this deal!
				</p>
			);
		}
	}
	return (
		<div>
			<Modal
				id="show-offer-modal"
				isOpen={true}
				contentLabel="show-offer-modal"
				ariaHideApp={false}
				style={{
					overlay: {display: "flex", justifyContent: "center"},
					content: {
						flex: "1",
						maxWidth: "650px",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "600px",
					},
				}}
			>
				<div className="flex flex-col align-items-start w-full h-full text-center">
					<ImCross
						className="self-end"
						onClick={() => {
							onClose();
						}}
					></ImCross>
					<h1 className="text-3xl">
						Offer status:{" "}
						<span style={{color: statusToSettingsMap[offer.status]}}>{offer.status}</span>
					</h1>

					<div
						className="flex-1 w-full flex flex-row justify-between p-6 mt-4 pb-0"
						style={{minHeight: "270px"}}
					>
						<div className="flex flex-col justify-start align-items-center text-center">
							<div style={{width: "150px"}}>
								<Avatar url={avatar} />
							</div>
							<p className="mt-2 text-lg">{parsedName}</p>
						</div>
						<div
							className="flex flex-col justify-center align-items-center"
							style={{maxHeight: "170px"}}
						>
							<IconContext.Provider
								value={{color: statusToSettingsMap[offer.status], size: "100px"}}
							>
								{getHandshakeIcon()}
							</IconContext.Provider>
						</div>
						<div
							className="flex flex-col justify-start align-items-center text-center"
							onClick={() => window.open("/user-profile/" + exLinkToId, "_blank").focus()}
						>
							<div style={{width: "150px"}}>
								<Avatar url={exAvatar} />
							</div>
							<p className="mt-2 text-lg">{exParsedName}</p>
						</div>
					</div>
					<div className={!showButtons ? (showReview ? "mt-4" : "mt-8") : ""}>
						<p className="text-2xl">
							{showReview && reviewState != ReviewStates.old
								? getReviewStatusText()
								: getStatusText()}
						</p>
						{getReviewParital()}
					</div>
					<div className="flex-1 pt-6 flex justify-around items-center">
						<button
							className={
								"w-36 h-12 rounded min-h-40 text-white bg-green-500 hover:bg-green-600 font-bold " +
								(!showButtons ? "hidden" : "")
							}
							onClick={() => {
								accept(offer.id);
								onClose();
							}}
						>
							Accept
						</button>
						<button
							className={
								"w-36 h-12 rounded min-h-40 text-white bg-red-500 hover:bg-red-600 font-bold " +
								(!showButtons ? "hidden" : "")
							}
							onClick={() => {
								reject(offer.id);
								onClose();
							}}
						>
							Decline
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
