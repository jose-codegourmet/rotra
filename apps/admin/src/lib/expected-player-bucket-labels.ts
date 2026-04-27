import type { ExpectedPlayerBucketDto } from "@/types/club-application-shared";

const MAP: Record<ExpectedPlayerBucketDto, string> = {
	one_to_ten: "1–10",
	eleven_to_twentyfive: "11–25",
	twentysix_to_fifty: "26–50",
	fiftyone_to_hundred: "51–100",
	hundred_plus: "100+",
};

export function expectedPlayerBucketLabel(
	bucket: ExpectedPlayerBucketDto,
): string {
	return MAP[bucket] ?? bucket;
}
