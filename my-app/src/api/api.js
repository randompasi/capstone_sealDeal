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

/**
 *
 * @param {string} url
 * @param {any} [params]
 * @returns {Promise<any>}
 */
export function get(url, params) {
	const paramsStr = params ? new URLSearchParams(params).toString() : "";
	const fullUrl = [getApiUrl(url), paramsStr].filter(Boolean).join("?");
	return fetch(fullUrl).then(parseResp);
}

/**
 * @param {string} url
 * @param {any} payload
 * @returns {Promise<any[]>}
 */
export const post = (url, payload) =>
	fetch(getApiUrl(url), {
		method: "POST",
		headers: baseHeaders,
		body: JSON.stringify(payload),
	}).then(parseResp);

/**
 * @param {string} entity
 * @param {number} id
 * @param {any} patch
 * @returns {Promise<any>}
 */
export const patch = (entity, id, patch) =>
	fetch(getApiUrl(`${entity}?id=eq.${id}`), {
		method: "PATCH",
		headers: baseHeaders,
		body: JSON.stringify(patch),
	}).then(parseResp);

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

// eslint-disable-next-line no-unused-vars
const userType = {
	id: 0,
	createdAt: "",
	firstName: "",
	lastName: "",
	city: "",
	birthday: "",
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
	}).then(parseResp);
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
