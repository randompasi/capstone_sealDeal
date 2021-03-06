import {useResource} from "../utils/hooks";
import * as api from "../api/api";
import {head} from "lodash";

/**
 * @param {number} id
 */
export default function useFullUserProfile(id, dependencies = []) {
	return useResource(
		() =>
			api
				.get("users", {
					select: ["*", "followers:following!followedUserId(*)"].join(","),
					id: api.matchers.eq(id),
				})
				.then(head),
		[id, ...dependencies]
	);
}
