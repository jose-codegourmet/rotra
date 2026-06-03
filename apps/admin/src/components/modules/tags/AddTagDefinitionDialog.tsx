"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { slugifyTagDefinitionSlug } from "@rotra/db";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
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
import { useCreateTagDefinition } from "@/hooks/useTagDefinitions/client";

import { addTagDefinitionFormDefault } from "./add-tag-definition-form/default";
import {
	type AddTagDefinitionFormValues,
	addTagDefinitionFormSchema,
} from "./add-tag-definition-form/schema";

const inputClassName =
	"h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary";

export function AddTagDefinitionDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateTagDefinition();
	const form = useForm<AddTagDefinitionFormValues>({
		resolver: zodResolver(addTagDefinitionFormSchema),
		defaultValues: addTagDefinitionFormDefault,
	});

	const label = form.watch("label");

	useEffect(() => {
		if (!label.trim()) return;
		try {
			const slug = slugifyTagDefinitionSlug(label);
			form.setValue("slug", slug, { shouldValidate: true });
		} catch {
			// ignore until label is valid
		}
	}, [label, form]);

	const isPending = createMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		if (isPending) return;
		createMutation.mutate(
			{
				slug: values.slug.trim(),
				label: values.label.trim(),
				assignableBy: values.assignableBy,
				...(values.description?.trim()
					? { description: values.description.trim() }
					: {}),
			},
			{
				onSuccess: () => {
					form.reset(addTagDefinitionFormDefault);
					onOpenChange(false);
				},
			},
		);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<FormProvider {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Add tag definition</DialogTitle>
							<DialogDescription>
								Create a catalog tag admins can assign to customer profiles.
							</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col gap-4 py-4">
							<Field data-invalid={!!form.formState.errors.label}>
								<FieldLabel htmlFor="tag-def-label">Label</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="label"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="tag-def-label"
													disabled={isPending}
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
							<Field data-invalid={!!form.formState.errors.slug}>
								<FieldLabel htmlFor="tag-def-slug">Slug</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="slug"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="tag-def-slug"
													disabled={isPending}
													className="font-mono"
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="tag-def-desc">
									Description (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="description"
										render={({ field }) => (
											<Input
												id="tag-def-desc"
												disabled={isPending}
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>
							<Field>
								<FieldLabel htmlFor="tag-def-assignable">
									Assignable by
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="assignableBy"
										render={({ field }) => (
											<select
												id="tag-def-assignable"
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
										<span className="sr-only">Creating</span>
									</>
								) : (
									"Create"
								)}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
