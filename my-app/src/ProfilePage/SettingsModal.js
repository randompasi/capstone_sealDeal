import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import ImageSelectModal from "./ImageSelectModal";
import profilePlaceholder from "../assets/ProfileImages/bird1.jpg";
import backgroundPlaceholder from "../assets/BackgroundImages/bg0.jpg";
import {useToggle} from "../utils/hooks";
import GridComponentsModal from "./GridComponentsModal/GridComponentsModal";

/**
 *
 * @param {ProfilePage.SettingsProps} props
 */
export default function SettingsModal({
	user,
	control,
	setBackgroundImage,
	setProfileImage,
	gridStateProps,
	gridComponents,
}) {
	const modalStates = {
		background: useToggle(),
		avatar: useToggle(),
		grid: useToggle(),
	};

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

	function getPremiumText(isPremium) {
		if (!isPremium) {
			return "Sorry! This feature is only available for premium users";
		}
		return;
	}

	function disableOnPremium(isPremium) {
		if (!isPremium) {
			return "flex flex-row justify-center items-center w-full p-8 filter grayscale pointer-events-none";
		}
		return "flex flex-row justify-center items-center w-full p-8";
	}

	return (
		<div>
			<Modal
				id="settings-modal"
				isOpen={control.showSettingsModal}
				contentLabel="Example Modal"
				ariaHideApp={false}
				style={{
					overlay: {display: "flex", justifyContent: "center", zIndex: 50},
					content: {
						flex: "1",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						inset: undefined,
						margin: 40,
					},
				}}
			>
				<h1 className="text-3xl">Profile customization</h1>
				<p className="mt-2">{getPremiumText(user.premium)}</p>
				<div className={disableOnPremium(user.premium)}>
					<SettingsModalButton
						label="Profile picture"
						image={profilePlaceholder}
						control={control}
						openState={modalStates.avatar}
					/>
					<SettingsModalButton
						label="Profile background"
						image={backgroundPlaceholder}
						control={control}
						openState={modalStates.background}
					/>
					<SettingsModalButton
						label="Profile page widgets"
						image={backgroundPlaceholder}
						control={control}
						openState={modalStates.grid}
					/>
				</div>
				<div className="flex flex-col items-center justify-center"></div>
				<div className="w-100">
					<button
						className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
						onClick={() => {
							control.setSettingsModal(false);
						}}
					>
						Cancel
					</button>
				</div>
			</Modal>

			{/* Background image selection modal */}
			<ImageSelectModal
				openState={modalStates.background}
				setImage={setBackgroundImage}
				imageSources={bgImages}
				headerText="Select a new profile background!"
			></ImageSelectModal>

			{/* Profile image selection modal */}
			<ImageSelectModal
				openState={modalStates.avatar}
				setImage={setProfileImage}
				imageSources={profileImages}
				headerText="Select a new profile picture!"
			></ImageSelectModal>

			<GridComponentsModal
				user={user}
				openState={modalStates.grid}
				gridStateProps={gridStateProps}
				gridComponents={gridComponents}
			/>
		</div>
	);
}

const makeCssUrl = (url) => `url('${url}')`;

function SettingsModalButton({image, openState, control, label}) {
	return (
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
					backgroundImage: makeCssUrl(image),
					backgroundRepeat: "no-repeat",
					backgroundSize: "cover",
					backgroundPosition: "center",
				}}
			></div>
			<button
				onClick={() => {
					control.setSettingsModal(false);
					openState.toggle();
				}}
				className="w-60 m-4 shadow bg-gray-700 hover:bg-gray-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
			>
				{label}
			</button>
		</div>
	);
}
