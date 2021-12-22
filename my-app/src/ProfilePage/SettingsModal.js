import {useState} from "react";
import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import ImageSelectModal from "./ImageSelectModal";
import profilePlaceholder from "../assets/ProfileImages/bird1.jpg";
import backgroundPlaceholder from "../assets/BackgroundImages/bg0.jpg";

export default function SettingsModal({
	settings,
	setSettings,
	setBackgroundImage,
	setProfileImage,
}) {
	const makeCssUrl = (url) => `url('${url}')`;

	const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);
	const [avatarModalVisible, setAvatarModalVisible] = useState(false);

	function importAll(r) {
		const images = [];
		r.keys().map((item) => {
			images.push(r(item));
		});
		return images;
	}

	const bgImages = importAll(
		// @ts-ignore
		require.context("../assets/BackgroundImages", false, /\.(png|jpe?g|svg)$/)
	);

	const profileImages = importAll(
		// @ts-ignore
		require.context("../assets/ProfileImages", false, /\.(png|jpe?g|svg)$/)
	);

	return (
		<div>
			<Modal
				id="settings-modal"
				isOpen={settings}
				contentLabel="Example Modal"
				ariaHideApp={false}
				style={{
					overlay: {display: "flex", justifyContent: "center"},
					content: {
						flex: "1",
						maxWidth: "760px",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "50%",
					},
				}}
			>
				<h1 className="text-3xl">Profile customization</h1>
				<div className="flex-1 w-full">
					<div className="flex flex-row justify-center items-center w-full p-8">
						<div className="flex flex-col items-center justify-center mt-8">
							<div
								id="profile-image"
								className="mr-3"
								style={{
									overflow: "hidden",
									height: 125,
									width: 125,
									borderRadius: 70,
									border: "4px solid rgb(56, 72, 97)",
									backgroundImage: makeCssUrl(profilePlaceholder),
									backgroundRepeat: "no-repeat",
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							></div>
							<button
								onClick={() => {
									setSettings(false);
									setAvatarModalVisible(true);
								}}
								className="w-60 m-4 shadow bg-gray-700 hover:bg-gray-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							>
								Profile picture
							</button>
						</div>
						<div className="flex flex-col items-center justify-center mt-8">
							<div
								id="profile-image"
								className="mr-3"
								style={{
									overflow: "hidden",
									height: 125,
									width: 200,
									border: "4px solid rgb(56, 72, 97)",
									backgroundImage: makeCssUrl(backgroundPlaceholder),
									backgroundRepeat: "no-repeat",
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							></div>
							<button
								onClick={() => {
									setSettings(false);
									setBackgroundModalVisible(true);
								}}
								className="w-60 m-4 shadow bg-gray-700 hover:bg-gray-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
							>
								Profile background
							</button>
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center"></div>
				<div className="w-100">
					<button
						className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
						onClick={() => {
							setSettings(false);
						}}
					>
						Cancel
					</button>
				</div>
			</Modal>

			{/* Background image selection modal */}
			<ImageSelectModal
				showModal={backgroundModalVisible}
				setModal={setBackgroundModalVisible}
				setImage={setBackgroundImage}
				imageSources={bgImages}
				headerText="Select a new profile background!"
			></ImageSelectModal>

			{/* Profile image selection modal */}
			<ImageSelectModal
				showModal={avatarModalVisible}
				setModal={setAvatarModalVisible}
				setImage={setProfileImage}
				imageSources={profileImages}
				headerText="Select a new profile picture!"
			></ImageSelectModal>
		</div>
	);
}
