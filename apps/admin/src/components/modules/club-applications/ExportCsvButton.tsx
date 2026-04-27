"use client";

import { Button } from "@/components/ui/button/Button";
import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

function escapeCsvCell(v: string): string {
	if (/[",\n]/.test(v)) return `"${v.replaceAll('"', '""')}"`;
	return v;
}

export type ExportCsvButtonProps = {
	rows: ClubApplicationListRowDto[];
	disabled?: boolean;
};

export function ExportCsvButton({ rows, disabled }: ExportCsvButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			disabled={disabled || rows.length === 0}
			onClick={() => {
				const headers = [
					"id",
					"applicantName",
					"applicantEmail",
					"clubName",
					"locationCity",
					"status",
					"updatedAt",
				];
				const lines = [
					headers.join(","),
					...rows.map((r) =>
						[
							r.id,
							r.applicantName,
							r.applicantEmail ?? "",
							r.clubName,
							r.locationCity,
							r.status,
							r.updatedAt,
						]
							.map((c) => escapeCsvCell(String(c)))
							.join(","),
					),
				];
				const blob = new Blob([lines.join("\n")], {
					type: "text/csv;charset=utf-8",
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.href = url;
				a.download = `club-applications-${new Date().toISOString().slice(0, 10)}.csv`;
				a.click();
				URL.revokeObjectURL(url);
			}}
		>
			Export CSV
		</Button>
	);
}
