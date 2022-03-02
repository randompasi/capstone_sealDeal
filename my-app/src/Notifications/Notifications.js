import "react-toastify/dist/ReactToastify.css";
import {ToastContainer, toast} from "react-toastify";
import {patch} from "../api/api";
import CongratulateOnOffer, {EmojiReaction} from "./CongratulateOnOffer";
import {useNotifications} from "./notificationsProvider";
import {useAsyncEffect} from "../utils/hooks";

export default function Notifications() {
	const {newestNotification: notification} = useNotifications();

	useAsyncEffect(async () => {
		if (!notification) {
			return;
		}
		await patch("notifications", notification.id, {seenAt: new Date().toISOString()});

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
	}, [notification]);

	return <ToastContainer pauseOnHover hideProgressBar />;
}
