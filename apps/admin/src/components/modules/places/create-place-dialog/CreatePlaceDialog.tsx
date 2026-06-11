"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
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
import { useCreatePlace } from "@/hooks/usePlaces/client";
import type { CreatePlacePayload } from "@/hooks/usePlaces/server";

import { defaultCreatePlaceValues } from "./default";
import {
	type CreatePlaceFormValues,
	createPlaceSchema,
} from "./schema";

const AddressPinField = dynamic(
	() =>
		import("@/components/ui/address-pin-field/AddressPinField").then(
			(mod) => mod.AddressPinField,
		),
	{ ssr: false },
);

export type CreatePlaceDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	onError: (error: unknown) => void;
};

function toCreatePayload(values: CreatePlaceFormValues): CreatePlacePayload {
	return {
		name: values.name.trim(),
		address: values.location.address,
		latitude: values.location.latitude,
		longitude: values.location.longitude,
		...(values.description?.trim()
			? { description: values.description.trim() }
			: {}),
		...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
		...(values.website?.trim() ? { website: values.website.trim() } : {}),
	};
}

export function CreatePlaceDialog({
	open,
	onOpenChange,
	onSuccess,
	onError,
}: CreatePlaceDialogProps) {
	const createMutation = useCreatePlace();
	const form = useForm<CreatePlaceFormValues>({
		resolver: zodResolver(createPlaceSchema),
		defaultValues: defaultCreatePlaceValues(),
	});

	const isPending = createMutation.isPending;
	const venueName = form.watch("name");

	useEffect(() => {
		if (open) {
			form.reset(defaultCreatePlaceValues());
		}
	}, [open, form]);

	useEffect(() => {
		const location = form.getValues("location");
		if (location.name !== venueName) {
			form.setValue("location", { ...location, name: venueName }, {
				shouldValidate: false,
			});
		}
	}, [venueName, form]);

	const onSubmit = form.handleSubmit((values) => {
		if (isPending) return;
		createMutation.mutate(toCreatePayload(values), {
			onSuccess: () => {
				onSuccess();
				onOpenChange(false);
			},
			onError: (error) => {
				onError(error);
			},
		});
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<FormProvider {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Add place</DialogTitle>
							<DialogDescription>
								Create a confirmed venue that appears on the player map.
							</DialogDescription>
						</DialogHeader>

						<div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto py-4">
							<Field data-invalid={!!form.formState.errors.name}>
								<FieldLabel htmlFor="create-place-name">Name</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="name"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="create-place-name"
													disabled={isPending}
													placeholder="Venue name"
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>

							<Field data-invalid={!!form.formState.errors.location}>
								<FieldContent>
									<Controller
										control={form.control}
										name="location"
										render={({ field, fieldState }) => (
											<>
												<AddressPinField
													value={field.value}
													onChange={field.onChange}
													label="Location"
													disabled={isPending}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="create-place-description">
									Description (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="description"
										render={({ field }) => (
											<Input
												id="create-place-description"
												disabled={isPending}
												placeholder="Court details, floor, etc."
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="create-place-phone">
									Phone (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="phone"
										render={({ field }) => (
											<Input
												id="create-place-phone"
												disabled={isPending}
												placeholder="+63 …"
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>

							<Field data-invalid={!!form.formState.errors.website}>
								<FieldLabel htmlFor="create-place-website">
									Website (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="website"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="create-place-website"
													type="url"
													disabled={isPending}
													placeholder="https://…"
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
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

CreatePlaceDialog.displayName = "CreatePlaceDialog";
