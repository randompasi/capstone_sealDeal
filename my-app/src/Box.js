import SectionTitle from "./common/components/SectionTitle";

/**
 * @param {ProfilePage.BoxProps} props
 */
export default function Box({children, className, title}) {
	return (
		<div className={`bg-gray-700 flex flex-col items-left gap-2 p-6 ${className || ""}`}>
			<div>{title && <SectionTitle>{title}</SectionTitle>}</div>
			<div>{children}</div>
		</div>
	);
}
