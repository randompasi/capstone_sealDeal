import trophy_url from "./../assets/trophy.png";
import award_url from "./../assets/award.png";
/**
 * @param {ProfilePage.AcievementProp} prop
 */
export default function Achievement(prop, width) {
	const nameToUrlMap = {
		trophy: trophy_url,
		award: award_url,
	};

	var width_value = width > 0 ? width : 100;

	return (
		<div style={{width: width_value}} className="flex flex-col justify-center text-center">
			<img src={nameToUrlMap[prop.iconType]} alt="Achievement" />
			<span>{prop.text}</span>
		</div>
	);
}
