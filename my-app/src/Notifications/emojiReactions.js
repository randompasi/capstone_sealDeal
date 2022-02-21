function importAll(r) {
	const imagesMap = new Map();
	r.keys().map((item) => {
		imagesMap.set(item, r(item));
	});
	return imagesMap;
}

export const emojiSvgs = importAll(
	// @ts-ignore
	require.context("../assets/emoji-svg", false, /\.svg$/)
);

const reaction = (emoji, label) => ({emoji, label});

export const reactionList = [
	reaction("💪", "Going strong"),
	reaction("😁", "Happy for you"),
	reaction("🤙", "Awesome"),
	reaction("🤟", "Rocking it"),
	reaction("👏", "Great work"),
	reaction("👊", "Fist bump"),
];
