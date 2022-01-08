import uniq from "lodash/uniq";
import Modal from "react-modal";

/**
 * @param {ProfilePage.DashboardComponentsModalProps} props
 */
export default function DashboardComponentsModal({
	openState,
	dashboardComponents,
	dashboardState,
	setDashboardState,
}) {
	const availableComponents = uniq(dashboardState.flatMap((_) => [_.a, _.b]).filter(Boolean));

	return (
		<Modal
			id="avatar-modal"
			isOpen={openState.isOpen}
			contentLabel="Settings Modal"
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
			<h1 className="text-3xl">Valitse komponentit dashboardille</h1>
			<div className="flex-1 w-full">
				<ul className="grid grid-cols-4 gap-4 w-full p-8">
					{openState.isOpen &&
						availableComponents.map((name) => (
							<li key={name} className="h-36">
								<div
									className="w-100 inline-block h-100 border-4 border-gray-700 hover:border-blue-300"
									style={{
										height: 150,
										width: 300,
									}}
								>
									{name}
								</div>
							</li>
						))}
				</ul>
			</div>
			<div className="w-100">
				<button
					className="w-32 h-8 rounded min-h-40 text-white bg-gray-700 hover:bg-gray-600 font-bold"
					onClick={() => {
						openState.toggle();
					}}
				>
					Cancel
				</button>
			</div>
		</Modal>
	);
}
