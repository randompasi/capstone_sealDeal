/**
 * @param {{children: React.ReactNode}} props
 * @returns
 */
export default function SectionTitle({children}) {
	return (
		<div className="font-semibold text-lg">
			<span>{children}</span>
		</div>
	);
}
