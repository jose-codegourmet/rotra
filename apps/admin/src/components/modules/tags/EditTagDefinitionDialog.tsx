"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { RESERVED_TAG_SLUGS } from "@rotra/db";
import { Loader2 } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog/Dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input/Input";
import { useUpdateTagDefinition } from "@/hooks/useTagDefinitions/client";
import type { TagDefinitionSerialized } from "@/hooks/useTagDefinitions/server";

const editSchema = z.object({
	label: z.string().min(1).max(120),
	description: z.string().max(500).optional(),
	assignableBy: z.enum(["any_admin", "super_admin_only"]),
	isActive: z.boolean(),
});

type EditValues = z.infer<typeof editSchema>;

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary";

export function EditTagDefinitionDialog({
	definition,
	open,
	onOpenChange,
}: {
	definition: TagDefinitionSerialized;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateMutation = useUpdateTagDefinition(definition.id);
	const isReserved = RESERVED_TAG_SLUGS.includes(
		definition.slug as (typeof RESERVED_TAG_SLUGS)[number],
	);

	const form = useForm<EditValues>({
		resolver: zodResolver(editSchema),
		defaultValues: {
			label: definition.label,
			description: definition.description ?? "",
			assignableBy: definition.assignableBy,
			isActive: definition.isActive,
		},
	});

	const isPending = updateMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		if (isPending) return;
		updateMutation.mutate(
			{
				label: values.label.trim(),
				assignableBy: values.assignableBy,
				isActive: values.isActive,
				...(values.description?.trim()
					? { description: values.description.trim() }
					: { description: null }),
			},
			{ onSuccess: () => onOpenChange(false) },
		);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<FormProvider {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Edit tag definition</DialogTitle>
							<DialogDescription>
								Slug: <code className="font-mono">{definition.slug}</code>
							</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col gap-4 py-4">
							<Field data-invalid={!!form.formState.errors.label}>
								<FieldLabel htmlFor="edit-tag-label">Label</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="label"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="edit-tag-label"
													disabled={isPending}
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="edit-tag-desc">Description</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="description"
										render={({ field }) => (
											<Input
												id="edit-tag-desc"
												disabled={isPending}
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="edit-tag-assignable">
									Assignable by
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="assignableBy"
										render={({ field }) => (
											<select
												id="edit-tag-assignable"
												className={inputClassName}
												disabled={isPending}
												{...field}
											>
												<option value="any_admin">Any admin</option>
												<option value="super_admin_only">
													Super admin only
												</option>
											</select>
										)}
									/>
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="edit-tag-active">Active</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="isActive"
										render={({ field }) => (
											<label className="flex items-center gap-2">
												<input
													id="edit-tag-active"
													type="checkbox"
													checked={field.value}
													disabled={isPending || isReserved}
													onChange={(e) => field.onChange(e.target.checked)}
													title={
														isReserved
															? "Reserved system tag cannot be deactivated"
															: undefined
													}
												/>
												<span className="text-body">
													{isReserved
														? "Active (reserved — cannot deactivate)"
														: "Active"}
												</span>
											</label>
										)}
									/>
								</FieldContent>
							</Field>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								disabled={isPending}
								onClick={() => onOpenChange(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden />
										<span className="sr-only">Saving</span>
									</>
								) : (
									"Save"
								)}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
