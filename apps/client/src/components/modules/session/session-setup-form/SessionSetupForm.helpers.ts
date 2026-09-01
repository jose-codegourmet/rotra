export function formatClockLabel(hhmm: string): string {
	const [hourText = "0", minuteText = "00"] = hhmm.split(":");
	const hours = Number(hourText);
	const minutes = Number(minuteText);
	const period = hours >= 12 ? "PM" : "AM";
	const hour12 = hours % 12 === 0 ? 12 : hours % 12;
	return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function addHoursToHhmm(hhmm: string, durationHours: number): string {
	const [hourText = "0", minuteText = "00"] = hhmm.split(":");
	const totalMinutes =
		Number(hourText) * 60 + Number(minuteText) + durationHours * 60;
	const wrapped = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
	const hours = Math.floor(wrapped / 60);
	const minutes = wrapped % 60;
	return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function formatDurationHoursLabel(hours: number): string {
	return hours === 1 ? "1 hour" : `${hours} hours`;
}

export function formatDurationOption(hours: number, startTime: string): string {
	return `${formatDurationHoursLabel(hours)} • ends ${formatClockLabel(addHoursToHhmm(startTime, hours))}`;
}

export function acceptedCapacity(
	courts: number,
	playersPerCourt: number,
): number {
	return courts * playersPerCourt;
}

export function buildStartTimeOptions(): { value: string; label: string }[] {
	const options: { value: string; label: string }[] = [];
	for (let minutes = 6 * 60; minutes <= 23 * 60 + 30; minutes += 30) {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		const value = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
		options.push({ value, label: formatClockLabel(value) });
	}
	return options;
}

export const SESSION_SETUP_START_TIME_OPTIONS = buildStartTimeOptions();
