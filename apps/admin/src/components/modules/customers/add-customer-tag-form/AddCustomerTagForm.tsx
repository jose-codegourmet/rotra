"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";
import { postCustomerTag } from "@/hooks/useCustomerDetail/server";
import { useTagDefinitionsQuery } from "@/hooks/useTagDefinitions/client";

import { addCustomerTagFormDefault } from "./default";
import {
	type AddCustomerTagFormValues,
	addCustomerTagFormSchema,
} from "./schema";

export type AddCustomerTagFormProps = {
	profileId: string;
	callerIsSuperAdmin: boolean;
	onDismiss: () => void;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

export function AddCustomerTagForm({
	profileId,
	callerIsSuperAdmin,
	onDismiss,
	onSuccess,
	onError,
}: AddCustomerTagFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: tagDefsData, isLoading: defsLoading } =
		useTagDefinitionsQuery();
	const form = useForm<AddCustomerTagFormValues>({
		resolver: zodResolver(addCustomerTagFormSchema),
		defaultValues: addCustomerTagFormDefault,
	});
	const {
		control,
		handleSubmit,
		reset,
		watch,
		formState: { errors },
	} = form;

	const slug = watch("slug");

	const assignableOptions = useMemo(() => {
		const definitions = tagDefsData?.definitions ?? [];
		return definitions.filter(
			(d) =>
				d.isActive &&
				(callerIsSuperAdmin || d.assignableBy !== "super_admin_only"),
		);
	}, [tagDefsData?.definitions, callerIsSuperAdmin]);

	const selectedDefinition = assignableOptions.find((d) => d.slug === slug);

	const mutation = useMutation({
		mutationFn: (tagSlug: string) => postCustomerTag(profileId, tagSlug),
		onError: (error) => {
			const safeMessage =
				error instanceof Error
					? error.message
					: "Something went wrong. Please try again.";
			toast.error(safeMessage);
			onError(error instanceof Error ? error : new Error(safeMessage));
		},
	});

	const isPending = mutation.isPending;
	const onSubmit = handleSubmit((values) => {
		if (isPending) return;
		mutation.mutate(values.slug, {
			onSuccess: () => {
				toast.success(
					selectedDefinition
						? `Tag "${selectedDefinition.label}" added.`
						: "Tag added.",
				);
				void queryClient.invalidateQueries({
					queryKey: [...adminNotificationsRootKey],
				});
				router.refresh();
				onSuccess();
				reset(addCustomerTagFormDefault);
			},
		});
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<Field data-invalid={!!errors.slug}>
					<FieldLabel htmlFor="add-tag-slug">Tag</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="slug"
							render={({ field, fieldState }) => (
								<>
									<select
										id="add-tag-slug"
										className="h-11 w-full rounded-md border border-border bg-bg-elevated px-3 text-body text-text-primary"
										disabled={isPending || defsLoading}
										value={field.value}
										onChange={field.onChange}
										aria-invalid={!!fieldState.error}
									>
										<option value="">
											{defsLoading
												? "Loading tags…"
												: "Select a tag definition"}
										</option>
										{assignableOptions.map((def) => (
											<option key={def.id} value={def.slug}>
												{def.label} ({def.slug})
											</option>
										))}
									</select>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				{selectedDefinition ? (
					<p className="text-body text-text-secondary">
						Label: <strong>{selectedDefinition.label}</strong>
						{selectedDefinition.description
							? ` — ${selectedDefinition.description}`
							: null}
					</p>
				) : null}

				<div className="flex justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						disabled={isPending}
						onClick={onDismiss}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isPending || !slug}>
						{isPending ? (
							<>
								<Loader2 className="size-4 animate-spin" aria-hidden />
								<span className="sr-only">Adding tag</span>
							</>
						) : (
							"Add tag"
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}

AddCustomerTagForm.displayName = "AddCustomerTagForm";
