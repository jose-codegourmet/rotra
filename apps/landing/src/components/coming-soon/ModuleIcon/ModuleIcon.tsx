import {
	ListOrdered,
	type LucideIcon,
	Radio,
	Scale,
	User,
	Users,
	Wallet,
} from "lucide-react";

import type { LandingModule } from "@/app/constants/coming-soon";

const map: Record<LandingModule["icon"], LucideIcon> = {
	"list-ordered": ListOrdered,
	radio: Radio,
	user: User,
	scale: Scale,
	users: Users,
	wallet: Wallet,
};

type ModuleIconProps = {
	icon: LandingModule["icon"];
	className?: string;
};

export function ModuleIcon({ icon, className }: ModuleIconProps) {
	const Cmp = map[icon];
	return <Cmp className={className} strokeWidth={1.5} aria-hidden />;
}
