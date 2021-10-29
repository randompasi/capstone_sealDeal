/**
 * @param {import('./types').BoxProps} props
 */
export default function Box({children, className}) {
	return (
		<div
			className={`bg-gray-700 flex items-center justify-between flex-wrap p-6 ${className || ""}`}
		>
			{children}
		</div>
	);
}
