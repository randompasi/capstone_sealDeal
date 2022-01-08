import Modal from "../../common/components/Modal";
import GridComponentsModalCard from "./GridComponentsModalCard";

/**
 * @param {ProfilePage.GridComponentsModalProps} props
 */
export default function GridComponentsModal({openState, gridComponents, gridStateProps}) {
	const usedComponents = new Set(
		gridStateProps.gridState.flatMap((_) => [_.a, _.b]).filter(Boolean)
	);
	const availableComponents = Object.keys(gridComponents).filter(
		// @ts-ignore
		(_) => !usedComponents.has(_)
	);

	return (
		<Modal
			title="Valitse komponentit dashboardille"
			isOpen={openState.isOpen}
			contentLabel="Grid components selection"
			onCancel={openState.toggle}
		>
			<ul className="grid grid-cols-4 gap-4 w-full p-8">
				{!availableComponents.length && <li>Ei jäljellä olevia widgettejä</li>}
				{openState.isOpen &&
					availableComponents.map((name) => (
						<li key={name} className="h-36">
							<GridComponentsModalCard>
								<div
									className="w-100 inline-block h-100 border-4 border-gray-700 hover:border-blue-300"
									style={{
										height: 150,
										width: 300,
									}}
								>
									{name}
								</div>
							</GridComponentsModalCard>
						</li>
					))}
			</ul>
		</Modal>
	);
}
