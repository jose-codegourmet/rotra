import { comingSoonMeta } from "@/app/constants/coming-soon";
import {
	WaitlistForm,
	type WaitlistFormAction,
} from "@/components/coming-soon/WaitlistForm/WaitlistForm";

type WaitlistSectionProps = {
	action?: WaitlistFormAction;
};

export function WaitlistSection({ action }: WaitlistSectionProps) {
	return (
		<section
			id="waitlist"
			aria-labelledby="waitlist-heading"
			className="relative z-20 -mt-8 flex w-full flex-col items-center px-4 pb-16 md:px-6"
		>
			<h2 id="waitlist-heading" className="sr-only">
				Join the waitlist
			</h2>
			{action ? <WaitlistForm action={action} /> : <WaitlistForm />}
			<p className="mt-4 max-w-xl text-center text-micro uppercase tracking-widest text-text-secondary">
				{comingSoonMeta.waitlistFinePrint}
			</p>
		</section>
	);
}
