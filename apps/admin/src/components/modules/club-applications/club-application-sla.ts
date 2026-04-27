import type { ClubApplicationListRowDto } from "@/types/club-application-admin";

const SLA_MS = 24 * 60 * 60 * 1000;

function pad(n: number): string {
	return n < 10 ? `0${n}` : String(n);
}

export function formatSlaRemaining(row: ClubApplicationListRowDto): string {
	if (row.status !== "pending" && row.status !== "in_review") {
		return "—";
	}
	const end = new Date(row.updatedAt).getTime() + SLA_MS;
	const left = end - Date.now();
	if (left <= 0) return "Overdue";
	const h = Math.floor(left / (60 * 60 * 1000));
	const m = Math.floor((left % (60 * 60 * 1000)) / (60 * 1000));
	return `${h}h ${pad(m)}m`;
}
