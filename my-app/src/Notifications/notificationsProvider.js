import {createContext, useEffect, useContext, useState} from "react";
import * as api from "../api/api";
import {useAuth} from "../auth/authContext";

const notificationsContext = createContext({
	newestNotification: null,
});

function useProvideNotifications() {
	const auth = useAuth();
	const userId = auth.user?.id;
	const [newestNotification, setNewestNotification] = useState(null);
	const [seenNotifications] = useState(() => new Set());

	useEffect(() => {
		if (!userId) {
			return;
		}
		let timeFilter = null;
		let unmounted = false;
		const pollInterval = setInterval(async function pollNotifications() {
			const notifications = await api.get("notifications", {
				userId: api.matchers.eq(userId),
				seenAt: api.matchers.eq(null),
				...timeFilter,
			});
			timeFilter = {
				createdAt: api.matchers.gt(new Date().toISOString()),
			};
			for (const notification of notifications) {
				if (unmounted) {
					break;
				}
				if (!seenNotifications.has(notification.id)) {
					setNewestNotification(notification);
					seenNotifications.add(notification.id);
					// Small dealy between notifications if we get many at once
					await new Promise((resolve) => setTimeout(resolve, 10));
				}
			}
		}, 5000);

		return () => {
			unmounted = true;
			clearInterval(pollInterval);
		};
	}, [userId]);

	return {newestNotification};
}

export function ProvideNotifications({children}) {
	const notificationsState = useProvideNotifications();
	return (
		<notificationsContext.Provider value={notificationsState}>
			{children}
		</notificationsContext.Provider>
	);
}

export const useNotifications = () => useContext(notificationsContext);
