import { AppHeader } from "@/components/network/AppHeader";

export default function LinkedInCloneLayout({ children }) {
	return (
		<div className="flex flex-col w-full min-h-screen">
			<AppHeader />
			<main className="flex-1 w-full bg-muted/30">
				<div className="w-full h-[calc(100vh-73px)] overflow-auto">
					<div className="mx-auto px-4 lg:px-24 py-6">{children}</div>
				</div>
			</main>
		</div>
	);
}
