import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {useEffect} from "react";
import {get, matchers, patch} from "../api/api";
import CongratulateOnOffer, {EmojiReaction} from "./CongratulateOnOffer";

/**
 * @param {ProfilePage.ProfilePageProps} props
 */
export default function Notifications(props) {
	useEffect(() => {
		let timeFilter = null;
		const interval = setInterval(async function pollNotifications() {
			const notifications = await get("notifications", {
				userId: matchers.eq(props.user.id),
				seenAt: matchers.eq(null),
				...timeFilter,
			});
			timeFilter = {
				createdAt: matchers.gt(new Date().toISOString()),
			};

			async function handleNotification(notification) {
				await patch("notifications", notification.id, {seenAt: new Date().toISOString()});
				console.log(notification);

				switch (notification.type) {
					case "offer_accepted":
						return toast(notification.title, {type: "success"});
					case "made_deal":
						return toast(<CongratulateOnOffer offerId={notification.data.offerId} />, {
							autoClose: 10000,
						});
					case "congrats":
						return toast(
							<div className="flex">
								<div>{notification.title}</div>
								<EmojiReaction
									reaction={{emoji: notification.data.reaction, label: notification.data.text}}
								/>
							</div>
						);
					default:
						return console.log("No handler for notification type ", notification);
				}
			}
			notifications.forEach(handleNotification);
		}, 8000 /* 8s */);

		return () => clearInterval(interval);
	}, [props.user.id]);
	return <ToastContainer pauseOnHover hideProgressBar />;
}
