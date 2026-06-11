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
import { useEditPlace } from "@/hooks/usePlaces/client";
import type { PlaceRow } from "@/hooks/usePlaces/server";

import { defaultEditPlaceValues } from "./default";
import { type EditPlaceFormValues, editPlaceSchema } from "./schema";

const AddressPinField = dynamic(
	() =>
		import("@/components/ui/address-pin-field/AddressPinField").then(
			(mod) => mod.AddressPinField,
		),
	{ ssr: false },
);

export type EditPlaceDialogProps = {
	place: PlaceRow;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSuccess: () => void;
	onError: (error: unknown) => void;
};

export function EditPlaceDialog({
	place,
	open,
	onOpenChange,
	onSuccess,
	onError,
}: EditPlaceDialogProps) {
	const editMutation = useEditPlace();
	const form = useForm<EditPlaceFormValues>({
		resolver: zodResolver(editPlaceSchema),
		defaultValues: defaultEditPlaceValues(place),
	});

	const isPending = editMutation.isPending;
	const venueName = form.watch("name");

	useEffect(() => {
		if (open) {
			form.reset(defaultEditPlaceValues(place));
		}
	}, [open, place, form]);

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
		editMutation.mutate(
			{
				id: place.id,
				name: values.name.trim(),
				address: values.location.address,
				latitude: values.location.latitude,
				longitude: values.location.longitude,
				...(values.description?.trim()
					? { description: values.description.trim() }
					: {}),
				...(values.phone?.trim() ? { phone: values.phone.trim() } : {}),
				...(values.website?.trim()
					? { website: values.website.trim() }
					: {}),
			},
			{
				onSuccess: () => {
					onSuccess();
					onOpenChange(false);
				},
				onError: (error) => {
					onError(error);
				},
			},
		);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<FormProvider {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Edit place</DialogTitle>
							<DialogDescription>
								Update venue details for {place.name}.
							</DialogDescription>
						</DialogHeader>

						<div className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto py-4">
							<Field data-invalid={!!form.formState.errors.name}>
								<FieldLabel htmlFor="edit-place-name">Name</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="name"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="edit-place-name"
													disabled={isPending}
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
								<FieldLabel htmlFor="edit-place-description">
									Description (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="description"
										render={({ field }) => (
											<Input
												id="edit-place-description"
												disabled={isPending}
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>

							<Field>
								<FieldLabel htmlFor="edit-place-phone">
									Phone (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="phone"
										render={({ field }) => (
											<Input
												id="edit-place-phone"
												disabled={isPending}
												{...field}
											/>
										)}
									/>
								</FieldContent>
							</Field>

							<Field data-invalid={!!form.formState.errors.website}>
								<FieldLabel htmlFor="edit-place-website">
									Website (optional)
								</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="website"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="edit-place-website"
													type="url"
													disabled={isPending}
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

EditPlaceDialog.displayName = "EditPlaceDialog";
