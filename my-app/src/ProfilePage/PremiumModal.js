import Modal from "react-modal"; //https://www.npmjs.com/package/react-modal
import {useAuth} from "../auth/authContext";
import {patchUser} from "../api/api";
import trophy_url from "../assets/trophy.png";
import {CgHeart} from "react-icons/cg";
import {IconContext} from "react-icons/lib";

export default function PremiumModal({control}) {
	const authContext = useAuth();
	const user = authContext.user;

	let buttonStyle = "w-32 bg-green-600 hover:bg-green-500";
	if (user.premium) {
		buttonStyle = "w-52 bg-red-500 hover:bg-red-400";
	}

	function modalBody(premium) {
		if (premium) {
			return (
				<div className="w-full h-full flex flex-col">
					<div className="w-4/4 text-center mb-2 mt-2">
						<span className="text-lg">Thank you for subscribing and enjoy your benefits!</span>
					</div>
					<div className="w-full h-3/4 flex flex-row">
						<div className="w-2/4 flex flex-col pt-3 text-center mt-4 mr-2">
							<span className="mb-3 mt-3">You can unsubscribe from bellow</span>
							<span className="mb-3 mt-3">However unsubscribing also removes you benefits</span>
							<span className="mb-3 mt-3">Help us save the environment and stay connected!</span>
							<span className="mb-3 mt-3">...and keep the Seals happy!</span>
						</div>
						<div className="w-2/4 h-3/4 ml-2 flex bg-red-200 rounded justify-center mt-8">
							<IconContext.Provider value={{color: "red", size: "230px"}}>
								<CgHeart className="bg"></CgHeart>
							</IconContext.Provider>
						</div>
					</div>
				</div>
			);
		}
		return (
			<div className="w-full h-full flex flex-col">
				<div className="w-4/4 text-center mb-2 mt-2">
					<span className="text-lg">Subscribing provides you with Many benefits!</span>
				</div>
				<div className="w-full h-3/4 flex flex-row">
					<div className="w-2/4 flex flex-col pt-3 text-center mt-4">
						<span className="mb-3 mt-3">Access to customisable Avatar</span>
						<span className="mb-3 mt-3">Additional SealPoints™</span>
						<span className="mb-3 mt-3">Access to background customization</span>
						<span className="mb-3 mt-3">...and More!</span>
					</div>
					<div className="w-2/4 h-3/4 flex bg-gray-700 rounded rounded-2xl justify-center mt-8">
						<img src={trophy_url} alt="Achievement" />
					</div>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Modal
				id="premium-modal"
				isOpen={control.showPremiumModal}
				contentLabel="premium-modal"
				ariaHideApp={false}
				style={{
					overlay: {display: "flex", justifyContent: "center"},
					content: {
						flex: "1",
						maxWidth: "600px",
						position: "relative",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						maxHeight: "500px",
					},
				}}
			>
				<h1 className="text-3xl">Subscription status: {user.premium ? "Premium" : "Free"}</h1>
				<div className="flex-1 w-full">{modalBody(user.premium)}</div>
				<div className="w-full flex">
					<div className="w-1/2 flex-1 flex justify-center">
						<button
							className={"h-8 rounded min-h-40 text-white font-bold " + buttonStyle}
							onClick={() => {
								patchUser(authContext, {
									premium: !user.premium,
								});
								user.premium = !user.premium;
								control.setPremiumModal(false);
							}}
						>
							{user.premium ? "Cancel subscription" : "Subscribe!"}
						</button>
					</div>
					<div className="w-1/2 flex-1 flex justify-centerflex-1 flex justify-center">
						<button
							className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
							onClick={() => {
								control.setPremiumModal(false);
							}}
						>
							Return
						</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}
