import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import Avatar from "../ProfilePage/Avatar";
import {FaRegHandshake, FaHandshakeSlash} from "react-icons/fa"; //react-icons.github.io/react-icons
import {ImCross} from "react-icons/im";
import {IconContext} from "react-icons/lib";

export default function OfferModal({control, offer, user, externalUser, reject, accept}) {
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

	let showButtons = true;
	if (
		offer.status != "pending" ||
		(offer.fromUserId == linkToId && offer.fromUserId !== offer.toUserId)
	) {
		showButtons = false;
	}

	function getStatusText() {
		if (offer.status == "pending" && showButtons) {
			return "Make a deal on '" + offer.productName + "' for " + offer.productPrice + "€ ?";
		} else if (offer.status == "pending") {
			return "Your offer for '" + offer.productName + "' - " + offer.productPrice + "€ is pending.";
		} else if (offer.status == "accepted") {
			return "You Sealed the Deal on '" + offer.productName + "' for " + offer.productPrice + "€ !";
		} else {
			return "This deal was rejected by the opposite party :(";
		}
	}

	function getHandshakeIcon() {
		if (offer.status == "rejected") {
			return <FaHandshakeSlash></FaHandshakeSlash>;
		}
		return <FaRegHandshake></FaRegHandshake>;
	}

	console.log(window);

	return (
		<div>
			<Modal
				id="show-offer-modal"
				isOpen={control.showOfferModal}
				contentLabel="show-offer-modal"
				ariaHideApp={false}
				style={{
					overlay: {display: "flex", justifyContent: "center"},
					content: {
						flex: "1",
						maxWidth: "600px",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "550px",
					},
				}}
			>
				<div className="flex flex-col align-items-start w-full h-full text-center">
					<ImCross
						className="self-end"
						onClick={() => {
							control.setShowOfferModal(false);
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
					<div className={!showButtons ? "mt-8" : ""}>
						<p className="text-2xl">{getStatusText()}</p>
					</div>
					<div className="flex-1 pt-6 flex justify-around items-center">
						<button
							className={
								"w-36 h-12 rounded min-h-40 text-white bg-green-500 hover:bg-green-600 font-bold " +
								(!showButtons ? "hidden" : "")
							}
							onClick={() => {
								accept(offer.id);
								control.setShowOfferModal(false);
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
								control.setShowOfferModal(false);
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
