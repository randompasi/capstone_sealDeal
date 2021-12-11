import {useState} from "react";
import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import ImageSelectModal from "./ImageSelectModal";

export default function SettingsModal({settings, setSettings, setBackgroundImage}) {
	const [backgroundModalVisible, setBackgroundModalVisible] = useState(false);

	function importAll(r) {
		const images = [];
		r.keys().map((item) => {
			images.push(r(item));
		});
		return images;
	}

	//@ts-ignore
	const bgImages = importAll(
		require.context("../assets/BackgroundImages", false, /\.(png|jpe?g|svg)$/)
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
						maxWidth: "970px",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						height: "95%",
					},
				}}
			>
				<h1 style={{textDecoration: "underline #a855f7"}} className="text-3xl font-bold">
					Customise your profile!
				</h1>
				<div className="flex-1 w-full">
					<div className="flex flex-col items-center w-full p-8">
						<button
							onClick={() => {
								setSettings(false);
								setBackgroundModalVisible(true);
							}}
							className="w-60 m-4 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
						>
							Profile background
						</button>
						<button className="w-60 m-4 shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
							Profile picture
						</button>
					</div>
				</div>
				<div className="flex flex-col items-center justify-center"></div>
				<div className="w-100">
					<button
						style={{backgroundColor: "rgb(56, 72, 97)", color: "#FFFFFF"}}
						className="w-32 h-8 rounded min-h-40"
						onClick={() => {
							setSettings(false);
						}}
					>
						Cancel
					</button>
				</div>
			</Modal>

			<ImageSelectModal
				showModal={backgroundModalVisible}
				setModal={setBackgroundModalVisible}
				setImage={setBackgroundImage}
				imageSources={bgImages}
			></ImageSelectModal>
		</div>
	);
}
