/**
 * @param {{children: React.ReactNode}} props
 * @returns
 */
export default function SectionTitle({children}) {
	return (
		<div className="h-1/3 font-semibold text-lg">
			<span>{children}</span>
		</div>
	);
}
