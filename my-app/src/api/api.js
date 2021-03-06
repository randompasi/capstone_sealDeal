import once from "lodash/once";
/** @type {string} */
const baseUrl = API_BASE_URL;
const getApiUrl = (/** @type {string} */ url) => `${baseUrl}/${url}`;

const usersMapKey = (/** @type {string} */ firstName, /** @type {string} */ lastName) =>
	`${firstName}_${lastName}`;

/**
 * @param {Response} resp
 */
async function parseResp(resp) {
	if (!resp.ok) {
		const text = await resp.text();
		throw new Error(`Request failed with ${resp.status} ${resp.statusText}: ${text}`);
	}

	return await resp.json();
}

const baseHeaders = {
	"Content-Type": "application/json",
	// Tells Postgrest to return the created object
	Prefer: "return=representation",
};

function request({url, params, ...options}) {
	const paramsStr = params ? new URLSearchParams(params).toString() : "";
	const fullUrl = [getApiUrl(url), paramsStr].filter(Boolean).join("?");
	return fetch(fullUrl, {method: "GET", ...options}).then(parseResp);
}

/**
 *
 * @param {string} url
 * @param {any} [params]
 * @returns {Promise<any>}
 */
export const get = (url, params) => request({url, params});

/**
 * @param {any} entity
 * @param {number} id
 * @returns
 */
export const remove = (entity, id) =>
	request({url: entity, params: {id: matchers.eq(id)}, method: "DELETE", headers: baseHeaders});

/**
 * @param {string} entity
 * @param {any} payload
 * @returns {Promise<any[]>}
 */
export const post = (entity, payload) =>
	request({
		url: entity,
		params: null,
		method: "POST",
		headers: baseHeaders,
		body: JSON.stringify(payload),
	});

/**
 * @param {string} entity
 * @param {number} id
 * @param {any} payload
 * @returns {Promise<any>}
 */
export const patch = (entity, id, payload) =>
	request({
		url: entity,
		params: {id: matchers.eq(id)},
		method: "PATCH",
		headers: baseHeaders,
		body: JSON.stringify(payload),
	});

/**
 * Saves changes to an item based on its id,
 * or creates a new item if the payload has no id.
 *
 * @param {string} entity
 * @param {any} payload
 */
export const upsert = (entity, {id, ...payload}) => {
	if (id) {
		return patch(entity, id, payload);
	} else {
		return post(entity, payload);
	}
};

/**
 * @param {any} authContext
 * @param {any} userPatch
 * @returns {Promise<any>}
 */
export async function patchUser(authContext, userPatch) {
	const {user} = authContext;
	await patch("users", user.id, userPatch);
	authContext.setCachedUser({...user, ...userPatch});
}

export function createOffer(offerPayload) {
	return post("offers", offerPayload);
}

export function createReview(offerPayload) {
	return post("reviews", offerPayload);
}

export function sendReview(from, to, score, type) {
	const payload = {
		fromUserId: from,
		toUserId: to,
		category: type,
		rating: score,
	};
	createReview(payload);
}

export function rewardPoints(userId, amount, base) {
	patch("users", userId, {points: amount + base});
}

export async function fetchSentOffers(userId) {
	const offers = await get("offers", {
		fromUserId: "eq." + userId,
		order: "status.asc,createdAt.desc",
	});
	return offers;
}

export async function fetchReceivedOffers(userId) {
	const offers = await get("offers", {
		toUserId: "eq." + userId,
		order: "status.asc,createdAt.desc",
	});
	return offers;
}

export async function updateOfferStatus(id, statusText) {
	if (!["pending", "accepted", "rejected"].includes(statusText)) {
		throw new Error(`Offer status: Gave invalid status code - ${statusText}`);
	}
	return patch("offers", id, {status: statusText});
}

export async function finishOfferReview(id, isSender) {
	if (isSender) {
		return patch("offers", id, {fromReview: true});
	}
	return patch("offers", id, {toReview: true});
}

// eslint-disable-next-line no-unused-vars
const userType = {
	id: 0,
	createdAt: "",
	firstName: "",
	lastName: "",
	city: "",
	birthday: "",
	profileGridId: 0,
	points: 0,
	// Note: avatar and background images are not included in the response
	// by default because they are quite large. Use a separate request
	// to fetch them as needed.
};
/**
 * @typedef {typeof userType} User
 */

/** @type {Map<string, User>} */
let usersMap;

/**
 * @returns {Promise<Map<string, User>>}
 */
const fetchUsersListOnce = once(async () => {
	const userKeys = Object.keys(userType);
	const users = await get("users", {
		select: userKeys.join(","),
	});
	return new Map(users.map((user) => [usersMapKey(user.firstName, user.lastName), user]));
});

/**
 * @returns {Promise<Map<string, User>>}
 */
export async function fetchAllUsers() {
	if (!usersMap) {
		usersMap = await fetchUsersListOnce();
	}
	return usersMap;
}

export async function getFullProfileById(id) {
	const user = await get("users", {
		id: "eq." + id,
	});
	return user[0];
}

export const getUserById = (id) => {
	let found = null;
	Array.from(usersMap.values()).some(function (user) {
		found = user;
		return user.id == id; //Break on found
	});
	return found;
};

export const getUserByName = (usersMap, firstName, lastName) =>
	usersMap.get(usersMapKey(firstName, lastName));

/**
 * @param {string} firstName
 * @param {string} lastName
 */
export async function login(firstName, lastName) {
	await fetchAllUsers();
	const user = getUserByName(usersMap, firstName, lastName);
	if (user) return user;
	else throw new Error(`No registered user ${firstName} ${lastName}`);
}

/**
 * @param {string} firstName
 * @param {string} lastName
 */
export async function signin(firstName, lastName) {
	const [newUser] = await post("users", {firstName, lastName});
	if (!newUser) {
		throw new Error(`Failed to create user ${firstName} ${lastName}`);
	}
	usersMap.set(usersMapKey(firstName, lastName), newUser);
	return newUser;
}

/**
 * Helpers to create Postgrest query string filters
 */
export const matchers = {
	eq(value) {
		return value === null ? `is.${value}` : `eq.${value}`;
	},
	gt(value) {
		return `gt.${value}`;
	},
	in(options) {
		return `in.${options.join(",")}`;
	},
};
