"use client";

import { type ComponentProps, useMemo } from "react";

import { cn } from "@/lib/utils";

function Field({ className, ...props }: ComponentProps<"div">) {
	return (
		// biome-ignore lint/a11y/useSemanticElements: Field mirrors composed form layout (not always a fieldset)
		<div
			role="group"
			data-slot="field"
			className={cn(
				"group/field flex w-full flex-col gap-1 data-[invalid=true]:text-error",
				className,
			)}
			{...props}
		/>
	);
}

function FieldContent({ className, ...props }: ComponentProps<"div">) {
	return (
		<div
			data-slot="field-content"
			className={cn("flex flex-col gap-0.5", className)}
			{...props}
		/>
	);
}

function FieldLabel({ className, ...props }: ComponentProps<"label">) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: Callers pair with inputs via htmlFor / nesting
		<label
			data-slot="field-label"
			className={cn(
				"text-small font-medium text-text-primary group-data-[disabled=true]/field:opacity-50",
				className,
			)}
			{...props}
		/>
	);
}

function FieldError({
	className,
	children,
	errors,
	...props
}: ComponentProps<"div"> & {
	errors?: Array<{ message?: string } | undefined>;
}) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors?.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map(
					(error, index) =>
						error?.message && <li key={index}>{error.message}</li>,
				)}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn("text-small font-normal text-error", className)}
			{...props}
		>
			{content}
		</div>
	);
}

export { Field, FieldContent, FieldError, FieldLabel };
