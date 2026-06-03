"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
	DialogTrigger,
} from "@/components/ui/dialog/Dialog";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input/Input";
import { useInviteTester } from "@/hooks/useTesters/client";
import type { TestersListQueryFilters } from "@/hooks/useTesters/queryKey";

const inviteSchema = z.object({
	email: z.string().email().max(320),
	name: z.string().min(1).max(120),
});

type InviteValues = z.infer<typeof inviteSchema>;

const defaultValues: InviteValues = { email: "", name: "" };

export function InviteNewTesterDialog({
	listFilters,
}: {
	listFilters: TestersListQueryFilters;
}) {
	const inviteMutation = useInviteTester(listFilters);
	const form = useForm<InviteValues>({
		resolver: zodResolver(inviteSchema),
		defaultValues,
	});

	const isPending = inviteMutation.isPending;

	const onSubmit = form.handleSubmit((values) => {
		if (isPending) return;
		inviteMutation.mutate({
			email: values.email.trim().toLowerCase(),
			name: values.name.trim(),
		});
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button type="button">Invite new tester</Button>
			</DialogTrigger>
			<DialogContent>
				<FormProvider {...form}>
					<form onSubmit={onSubmit}>
						<DialogHeader>
							<DialogTitle>Invite new tester</DialogTitle>
							<DialogDescription>
								Sends a Supabase invite email with tester password and login
								link.
							</DialogDescription>
						</DialogHeader>

						<div className="flex flex-col gap-4 py-4">
							<Field data-invalid={!!form.formState.errors.email}>
								<FieldLabel htmlFor="tester-email">Email</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="email"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="tester-email"
													type="email"
													disabled={isPending}
													{...field}
												/>
												<FieldError errors={[fieldState.error]} />
											</>
										)}
									/>
								</FieldContent>
							</Field>
							<Field data-invalid={!!form.formState.errors.name}>
								<FieldLabel htmlFor="tester-name">Display name</FieldLabel>
								<FieldContent>
									<Controller
										control={form.control}
										name="name"
										render={({ field, fieldState }) => (
											<>
												<Input
													id="tester-name"
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
							<Button type="submit" disabled={isPending}>
								{isPending ? (
									<>
										<Loader2 className="size-4 animate-spin" aria-hidden />
										<span className="sr-only">Sending invite</span>
									</>
								) : (
									"Send invite"
								)}
							</Button>
						</DialogFooter>
					</form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	);
}
