"use client";

import { Field, FieldLabel } from "@/components/ui/field/Field";
import { Input } from "@/components/ui/input/Input";
import {
	NativeSelect,
	NativeSelectOption,
} from "@/components/ui/native-select/NativeSelect";

type AdminUsersTableFiltersProps = {
	search: string;
	statusFilter: string;
	shownCount: number;
	onSearchChange: (nextValue: string) => void;
	onStatusChange: (nextValue: string) => void;
};

export function AdminUsersTableFilters({
	search,
	statusFilter,
	shownCount,
	onSearchChange,
	onStatusChange,
}: AdminUsersTableFiltersProps) {
	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
			<Field className="flex min-h-12 flex-1 flex-col gap-1 sm:max-w-xs">
				<FieldLabel className="text-label uppercase text-text-secondary">
					Search
				</FieldLabel>
				<Input
					type="search"
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder="Name or email"
				/>
			</Field>

			<Field className="flex min-h-12 flex-col gap-1 sm:w-48">
				<FieldLabel className="text-label uppercase text-text-secondary">
					Status
				</FieldLabel>
				<NativeSelect
					value={statusFilter === "" ? "all" : statusFilter}
					onChange={(e) => onStatusChange(e.target.value)}
					className="w-full"
				>
					<NativeSelectOption value="all">All users</NativeSelectOption>
					<NativeSelectOption value="invited">Invited</NativeSelectOption>
					<NativeSelectOption value="active">Active</NativeSelectOption>
					<NativeSelectOption value="inactive">Inactive</NativeSelectOption>
				</NativeSelect>
			</Field>

			<p className="text-small text-text-secondary sm:ml-auto sm:self-end">
				{shownCount} shown
			</p>
		</div>
	);
}
