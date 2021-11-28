import {useState} from "react";
import ImageSelectModal from "./ImageSelectModal";

/**
 * @param {ProfilePage.AvatarProps} props
 */
export default function Avatar({url}) {
	const size = 100;

	/**
	 * Magic for importing a folder dynamically:
	 * https://shaquillegalimba.medium.com/how-to-import-multiple-images-in-react-1936efeeae7b
	 */
	function importAll(r) {
		let images = [];
		r.keys().map((item) => {
			images.push(r(item));
		});
		return images;
	}
	//require.context complains about an error but still works hmm.
	const images = importAll(require.context("../assets/ProfileImages", false, /\.(png|jpe?g|svg)$/));

	const [showModal, setModal] = useState(false);
	const [image, setImage] = useState(url);

	const makeCssUrl = (url) => `url('${url}')`;

	return (
		<div>
			<div
				id="profile-image"
				className="mr-3"
				onClick={() => {
					setModal(true);
				}}
				style={{
					overflow: "hidden",
					height: size,
					width: size,
					borderRadius: 50,
					border: "2px solid #ccc",
					backgroundImage: makeCssUrl(image),
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			></div>
			<ImageSelectModal
				showModal={showModal}
				setModal={setModal}
				setImage={setImage}
				imageSources={images}
			/>
		</div>
	);
}
