/** @type {string} */
const baseUrl = API_BASE_URL;
const getApiUrl = (/** @type {string} */ url) => `${baseUrl}/${url}`;

/** @type {Map<string, any>} */
let usersMap;

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
 * @returns {Promise<any>}
 */
export const get = (url) => fetch(getApiUrl(url)).then(parseResp);
/**
 * @param {string} url
 * @param {any} payload
 * @returns {Promise<any>}
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

export async function fetchAllUsers() {
	if (!usersMap) {
		const users = await fetch(getApiUrl("users")).then(parseResp);
		usersMap = new Map(users.map((user) => [usersMapKey(user.firstName, user.lastName), user]));
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
	const newUser = await post("users", {firstName, lastName});
	usersMap.set(usersMapKey(firstName, lastName), newUser);
	return newUser;
}