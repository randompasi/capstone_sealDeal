import {useAuth} from "../auth/authContext";
import {makeCssUrl} from "../common/utils";
import useFullUserProfile from "../ProfilePage/useFullUserProfile";
import defaultBackground from "../assets/BackgroundImages/bg_default.jpg";
import Offer from "./Offer";

export default function OffersView() {
	const authContext = useAuth();
	const fetchedProfile = useFullUserProfile(authContext.user.id);
	if (fetchedProfile.status !== "success") {
		return null;
	}
	const loggedInUser = fetchedProfile.value;

	let parsedBgUrl = makeCssUrl(defaultBackground);
	if (loggedInUser.premium) {
		parsedBgUrl = makeCssUrl(loggedInUser.backgroundBase64);
	}

	const mockupOffers = [
		{id: 1, productName: "Car tires", productPrice: 299.99, status: "accepted"},
		{id: 2, productName: "Snowboard", productPrice: 399.99, status: "accepted"},
		{id: 3, productName: "Graphics card", productPrice: 499.99, status: "pending"},
		{id: 4, productName: "Macbook Air", productPrice: 599.99, status: "rejected"},
	];

	return (
		<div
			id="offers-page-container"
			className="flex flex-col items-center h-screen w-screen"
			style={{backgroundImage: parsedBgUrl, backgroundSize: "cover"}}
		>
			<div
				className="w-full sm:w-10/12 xl:w-5/12 p-8 pt-4 mt-8 gap-x-8 mb-8 h-full text-black"
				style={{backgroundColor: "white"}}
			>
				<div className="flex flex-col">
					<p className="text-xl mt-4 mb-2">Create new offer:</p>
                    <p> - - Insert cool interface here - - </p>
				</div>
				<p className="text-xl mt-4 mb-2">Sent offers:</p>
				<div className="flex flex-col bg-gray-700 p-4 rounded">
					{mockupOffers.map((offer) => (
						<Offer key={offer.id} offer={offer} />
					))}
				</div>
				<p className="text-xl mt-4 mb-2">Received offers:</p>
				<div className="flex flex-col bg-gray-700 p-4 rounded">
					{mockupOffers.map((offer) => (
						<Offer className="mt-2 mb-2" key={offer.id} offer={offer} />
					))}
				</div>
			</div>
		</div>
	);
}
