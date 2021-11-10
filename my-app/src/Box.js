import SectionTitle from "./common/components/SectionTitle";

/**
 * @param {ProfilePage.BoxProps} props
 */
export default function Box({children, className, title}) {
	return (
		<div
			className={`bg-gray-700 flex items-center justify-between flex-wrap p-6 ${className || ""}`}
		>
			{title && <SectionTitle>{title}</SectionTitle>}
			{children}
		</div>
	);
}
