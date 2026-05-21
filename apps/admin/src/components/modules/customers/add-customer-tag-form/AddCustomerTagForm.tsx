"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { slugifyTag } from "@rotra/db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button/Button";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input/Input";
import { adminNotificationsRootKey } from "@/hooks/useAdminNotifications/queryKey";
import { postCustomerTag } from "@/hooks/useCustomerDetail/server";

import { addCustomerTagFormDefault } from "./default";
import {
	type AddCustomerTagFormValues,
	addCustomerTagFormSchema,
} from "./schema";

export type AddCustomerTagFormProps = {
	profileId: string;
	onDismiss: () => void;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

export function AddCustomerTagForm({
	profileId,
	onDismiss,
	onSuccess,
	onError,
}: AddCustomerTagFormProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const form = useForm<AddCustomerTagFormValues>({
		resolver: zodResolver(addCustomerTagFormSchema),
		defaultValues: addCustomerTagFormDefault,
	});
	const {
		control,
		handleSubmit,
		reset,
		formState: { errors },
	} = form;

	const mutation = useMutation({
		mutationFn: (label: string) => postCustomerTag(profileId, label),
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
		const label = values.label.trim();
		mutation.mutate(label, {
			onSuccess: () => {
				const slug = slugifyTag(label);
				toast.success(`Tag added (slug: ${slug}).`);
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
				<Field data-invalid={!!errors.label}>
					<FieldLabel htmlFor="add-tag-label">Tag label</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="label"
							render={({ field, fieldState }) => (
								<>
									<Input
										id="add-tag-label"
										type="text"
										disabled={isPending}
										placeholder="e.g. beta tester - scheduling"
										aria-invalid={!!fieldState.error}
										{...field}
									/>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<div className="flex justify-end gap-2 pt-2">
					<Button
						type="button"
						variant="outline"
						disabled={isPending}
						onClick={onDismiss}
					>
						Cancel
					</Button>
					<Button type="submit" disabled={isPending}>
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
