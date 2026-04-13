export interface PageSectionProps {
	title: string;
	description?: string;
	children: React.ReactNode;
}

export function PageSection({
	title,
	description,
	children,
}: PageSectionProps) {
	return (
		<section className="space-y-4">
			<div>
				<h2 className="text-heading text-text-primary">{title}</h2>
				{description ? (
					<p className="mt-1 text-body text-text-secondary">{description}</p>
				) : null}
			</div>
			{children}
		</section>
	);
}

PageSection.displayName = "PageSection";
