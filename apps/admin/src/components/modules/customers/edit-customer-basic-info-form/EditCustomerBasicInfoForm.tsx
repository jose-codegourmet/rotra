"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
import { patchCustomerIdentity } from "@/hooks/useCustomerDetail/server";
import type { CustomerProfileSerialized } from "@/types/customer-profile-serialized";

import { buildEditCustomerBasicInfoFormDefaults } from "./default";
import {
	type EditCustomerBasicInfoFormValues,
	editCustomerBasicInfoFormSchema,
} from "./schema";

export type EditCustomerBasicInfoFormProps = {
	profileId: string;
	profile: CustomerProfileSerialized;
	onDismiss: () => void;
	onSuccess: () => void;
	onError: (error: Error) => void;
};

export function EditCustomerBasicInfoForm({
	profileId,
	profile,
	onDismiss,
	onSuccess,
	onError,
}: EditCustomerBasicInfoFormProps) {
	const router = useRouter();
	const defaultValues = buildEditCustomerBasicInfoFormDefaults(profile);
	const form = useForm<EditCustomerBasicInfoFormValues>({
		resolver: zodResolver(editCustomerBasicInfoFormSchema),
		defaultValues,
	});
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = form;

	const mutation = useMutation({
		mutationFn: (values: EditCustomerBasicInfoFormValues) =>
			patchCustomerIdentity(profileId, {
				name: values.name.trim(),
				email: values.email.trim() === "" ? null : values.email.trim(),
				phone: values.phone.trim() === "" ? null : values.phone.trim(),
			}),
		onSuccess: () => {
			toast.success("Basic information updated.");
			onSuccess();
			router.refresh();
		},
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
		mutation.mutate(values);
	});

	return (
		<FormProvider {...form}>
			<form onSubmit={onSubmit} className="space-y-4">
				<Field data-invalid={!!errors.name}>
					<FieldLabel htmlFor="edit-customer-name">Name</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="name"
							render={({ field, fieldState }) => (
								<>
									<Input
										id="edit-customer-name"
										type="text"
										disabled={isPending}
										aria-invalid={!!fieldState.error}
										{...field}
									/>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<Field data-invalid={!!errors.email}>
					<FieldLabel htmlFor="edit-customer-email">Email</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="email"
							render={({ field, fieldState }) => (
								<>
									<Input
										id="edit-customer-email"
										type="email"
										autoComplete="email"
										disabled={isPending}
										placeholder="Leave empty to clear"
										aria-invalid={!!fieldState.error}
										value={field.value ?? ""}
										onChange={(e) => field.onChange(e.target.value)}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
									/>
									<FieldError errors={[fieldState.error]} />
								</>
							)}
						/>
					</FieldContent>
				</Field>

				<Field data-invalid={!!errors.phone}>
					<FieldLabel htmlFor="edit-customer-phone">Phone</FieldLabel>
					<FieldContent>
						<Controller
							control={control}
							name="phone"
							render={({ field, fieldState }) => (
								<>
									<Input
										id="edit-customer-phone"
										type="tel"
										autoComplete="tel"
										disabled={isPending}
										placeholder="Leave empty to clear"
										aria-invalid={!!fieldState.error}
										value={field.value ?? ""}
										onChange={(e) => field.onChange(e.target.value)}
										onBlur={field.onBlur}
										name={field.name}
										ref={field.ref}
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
								<span className="sr-only">Saving</span>
							</>
						) : (
							"Save"
						)}
					</Button>
				</div>
			</form>
		</FormProvider>
	);
}

EditCustomerBasicInfoForm.displayName = "EditCustomerBasicInfoForm";
