"use client";

import type { Meta, StoryObj } from "@storybook/react";
import type { PaginationState } from "@tanstack/react-table";
import * as React from "react";
import { AdminWaitlistTable } from "@/components/modules/waitlist/AdminWaitlistTable/AdminWaitlistTable";
import { WaitlistStats } from "@/components/modules/waitlist/WaitlistStats/WaitlistStats";
import {
	MOCK_WAITLIST_ROWS,
	MOCK_WAITLIST_STATS,
	MOCK_WAITLIST_TOTAL,
} from "@/constants/mock-waitlist";

import { WaitlistLayout } from "./WaitlistLayout";

function WaitlistModuleDemo() {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	const start = pagination.pageIndex * pagination.pageSize;
	const slice = MOCK_WAITLIST_ROWS.slice(start, start + pagination.pageSize);

	return (
		<WaitlistLayout
			stats={
				<WaitlistStats
					stats={MOCK_WAITLIST_STATS}
					isLoading={false}
					isError={false}
				/>
			}
			table={
				<AdminWaitlistTable
					rows={slice}
					total={MOCK_WAITLIST_TOTAL}
					pagination={pagination}
					onPaginationChange={setPagination}
					isLoading={false}
					isFetching={false}
					isError={false}
				/>
			}
		/>
	);
}

const meta: Meta<typeof WaitlistLayout> = {
	title: "rotra/WaitlistLayout",
	component: WaitlistLayout,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof WaitlistLayout>;

export const Default: Story = {
	render: () => <WaitlistModuleDemo />,
};
