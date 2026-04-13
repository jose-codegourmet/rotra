import { PageSection } from "@/components/admin-ui/PageSection/PageSection";
import { PageTable } from "@/components/admin-ui/PageTable/PageTable";
import { Button } from "@/components/ui/button/Button";
import {
	type ConfigRow,
	MOCK_PLATFORM_CONFIG,
} from "@/constants/mock-admin-pages";

export default function PlatformConfigPage() {
	const byCategory = MOCK_PLATFORM_CONFIG.reduce<Record<string, ConfigRow[]>>(
		(acc, row) => {
			const cat = row.category;
			if (!acc[cat]) acc[cat] = [];
			acc[cat].push(row);
			return acc;
		},
		{},
	);

	return (
		<div className="mx-auto max-w-4xl space-y-10">
			{Object.entries(byCategory).map(([category, rows]) => (
				<PageSection
					key={category}
					title={category}
					description="Key / value pairs from mock data. Edit buttons do not persist."
				>
					<PageTable minWidthClassName="min-w-[560px]">
						<thead>
							<tr className="border-b border-border bg-bg-base">
								<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
									Key
								</th>
								<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
									Value
								</th>
								<th className="px-4 py-3 text-micro font-bold uppercase tracking-widest text-text-secondary">
									Actions
								</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-border last:border-0 hover:bg-bg-elevated/50"
								>
									<td className="px-4 py-3 font-mono text-small text-text-primary">
										{row.key}
									</td>
									<td className="px-4 py-3 text-text-secondary">
										{row.value}
										{row.unit ? (
											<span className="text-text-disabled"> {row.unit}</span>
										) : null}
									</td>
									<td className="px-4 py-3">
										<Button type="button" variant="ghost" size="sm">
											Edit
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</PageTable>
				</PageSection>
			))}
		</div>
	);
}
