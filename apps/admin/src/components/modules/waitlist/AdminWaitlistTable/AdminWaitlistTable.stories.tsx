"use client";

import type { Meta, StoryObj } from "@storybook/react";
import type { PaginationState } from "@tanstack/react-table";
import * as React from "react";

import {
	MOCK_WAITLIST_ROWS,
	MOCK_WAITLIST_TOTAL,
} from "@/constants/mock-waitlist";

import { AdminWaitlistTable } from "./AdminWaitlistTable";

function PaginatedTableStory({
	initialPageIndex = 0,
	pageSize = 10,
}: {
	initialPageIndex?: number;
	pageSize?: number;
}) {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: initialPageIndex,
		pageSize,
	});

	const start = pagination.pageIndex * pagination.pageSize;
	const slice = MOCK_WAITLIST_ROWS.slice(start, start + pagination.pageSize);

	return (
		<AdminWaitlistTable
			rows={slice}
			total={MOCK_WAITLIST_TOTAL}
			pagination={pagination}
			onPaginationChange={setPagination}
			isLoading={false}
			isFetching={false}
			isError={false}
		/>
	);
}

function LoadingStory() {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	return (
		<AdminWaitlistTable
			rows={[]}
			total={0}
			pagination={pagination}
			onPaginationChange={setPagination}
			isLoading
			isFetching={false}
			isError={false}
		/>
	);
}

function EmptyStory() {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	return (
		<AdminWaitlistTable
			rows={[]}
			total={0}
			pagination={pagination}
			onPaginationChange={setPagination}
			isLoading={false}
			isFetching={false}
			isError={false}
		/>
	);
}

function ErrorStory() {
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	return (
		<AdminWaitlistTable
			rows={[]}
			total={0}
			pagination={pagination}
			onPaginationChange={setPagination}
			isLoading={false}
			isFetching={false}
			isError
			error={new Error("Failed to load waitlist.")}
		/>
	);
}

const meta: Meta<typeof AdminWaitlistTable> = {
	title: "rotra/AdminWaitlistTable",
	component: AdminWaitlistTable,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AdminWaitlistTable>;

export const Default: Story = {
	render: () => <PaginatedTableStory />,
};

export const SecondPage: Story = {
	render: () => <PaginatedTableStory initialPageIndex={1} pageSize={10} />,
};

export const Loading: Story = {
	render: () => <LoadingStory />,
};

export const Empty: Story = {
	render: () => <EmptyStory />,
};

export const ErrorState: Story = {
	render: () => <ErrorStory />,
};
