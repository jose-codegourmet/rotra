export default function EnvironmentsPage() {
	return (
		<div className="mx-auto max-w-3xl space-y-3">
			<p className="text-body text-text-secondary">
				Dev / staging / production configuration. Static view only.
			</p>
			<ul className="list-inside list-disc text-body text-text-secondary">
				<li>Environment selector (placeholder)</li>
				<li>Config diff / read-only fields (placeholder)</li>
			</ul>
		</div>
	);
}
