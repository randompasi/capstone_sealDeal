import {shuffle} from "lodash";
import {useState} from "react";
import {get, matchers, post} from "../api/api";
import {useResource} from "../utils/hooks";
import {emojiSvgs, reactionList} from "./emojiReactions";
import ReactTooltip from "react-tooltip"; //https://www.npmjs.com/package/react-tooltip
import {useAuth} from "../auth/authContext";
import {fullName} from "../common/utils";
import {toast} from "react-toastify";

/**
 * @param {{offerId: number}} props
 */
export default function CongratulateOnOffer({offerId}) {
	const [reactionOptions] = useState(() => shuffle(reactionList).slice(0, 3));
	const auth = useAuth();
	const offerResource = useResource(async () => {
		const [offer] = await get("offers", {
			id: matchers.eq(offerId),
			select: "*,toUser:users!toUserId(id,firstName,lastName)",
		});
		return offer;
	}, [offerId]);
	if (offerResource.status !== "success" || !offerResource.value) {
		return null;
	}
	const offer = offerResource.value;
	const fromUser = auth.user;
	const sellerName = fullName(offer.toUser);

	const onReactionClick = async (reaction) => {
		await post("congratulations", {
			fromUserId: fromUser.id,
			toUserId: offer.toUserId,
			reaction: reaction.emoji,
			text:
				`Congrats on selling that ${offer.productName}!` +
				`\n${fromUser.firstName} ${fromUser.lastName} says ${reaction.label}!`,
		});
		toast("Congrats sent!", {type: "success"});
	};

	return (
		<div>
			{sellerName} just sold {offer.productName}! Congratulate {offer.toUser.firstName} on their
			sweet deal?
			<div className="flex mt-2">
				{reactionOptions.map((reaction) => (
					<EmojiReaction key={reaction.label} reaction={reaction} onClick={onReactionClick} />
				))}
			</div>
		</div>
	);
}

/**
 * @param {{reaction: {emoji: string, label: string}, onClick?: Function}} props
 */
export function EmojiReaction({reaction, onClick}) {
	const emojiUnicodeCode = reaction.emoji.codePointAt(0).toString(16).toUpperCase();
	const svgFileName = `./${emojiUnicodeCode}.svg`;
	const svgFilePath = emojiSvgs.get(svgFileName);
	if (!svgFilePath) {
		return null;
	}
	const clickProps = onClick ? {onClick: () => onClick(reaction), className: "cursor-pointer"} : {};
	const label = `${reaction.label}!`;
	const size = 80;
	return (
		<div data-tip={label}>
			<div {...clickProps}>
				<img
					src={svgFilePath}
					alt={label}
					style={{
						width: size,
						height: size,
						marginRight: 10,
					}}
				/>
			</div>
			<ReactTooltip place="right" type="dark" effect="float" multiline={true} />
		</div>
	);
}
