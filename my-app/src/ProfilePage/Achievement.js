import trophy_url from "./../assets/trophy.png";
import award_url from "./../assets/award.png";
import ReactTooltip from "react-tooltip"; //https://www.npmjs.com/package/react-tooltip

/**
 * @param {ProfilePage.AcievementProp} prop
 */
export default function Achievement(prop) {
	const nameToUrlMap = {
		trophy: trophy_url,
		award: award_url,
	};

	return (
		<div className="flex flex-col justify-center text-center">
			<img src={nameToUrlMap[prop.iconType]} alt="Achievement" data-tip={prop.description} />
			<ReactTooltip place="right" type="dark" effect="float" multiline={true} />
			<span>{prop.text}</span>
		</div>
	);
}
