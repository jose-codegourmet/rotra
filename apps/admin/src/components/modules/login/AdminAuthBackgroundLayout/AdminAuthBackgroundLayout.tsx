import DarkVeil from "@/components/ui/dark-veil/DarkVeil";
import { Logo } from "@/components/ui/logo/Logo";

type AdminAuthBackgroundLayoutProps = {
	children: React.ReactNode;
	tagline: string;
};

export function AdminAuthBackgroundLayout({
	children,
	tagline,
}: AdminAuthBackgroundLayoutProps) {
	return (
		<div className="relative min-h-screen overflow-hidden bg-black">
			<div className="absolute inset-0">
				<DarkVeil speed={1.4} />
			</div>

			<div
				className="absolute inset-0"
				style={{ background: "rgba(0,0,0,0.55)" }}
			/>

			<div className="pointer-events-none absolute inset-0">
				<div
					className="absolute left-1/4 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
					style={{ background: "rgba(59,130,246,0.05)" }}
				/>
				<div
					className="absolute bottom-1/4 right-1/3 h-[320px] w-[320px] rounded-full blur-3xl"
					style={{ background: "rgba(100,120,180,0.04)" }}
				/>
			</div>

			<main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-12">
				<div
					className="mb-8 flex flex-col items-center text-center"
					style={{ animation: "fadeUp 500ms ease-out both" }}
				>
					<Logo variant="dark" className="w-48" />
					<p
						className="mt-3 text-xs font-medium uppercase"
						style={{ color: "#9090A0", letterSpacing: "0.2em" }}
					>
						{tagline}
					</p>
				</div>

				<div
					style={{
						animation: "fadeUp 500ms 80ms ease-out both",
						width: "100%",
						maxWidth: "420px",
					}}
				>
					{children}
				</div>
			</main>

			<style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
		</div>
	);
}
