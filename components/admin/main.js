// components/Main.js
import { Button } from "@components/ui/button";
import { Menu } from "lucide-react";

export default function Main({ children, sidebarOpen, setSidebarOpen }) {
	return (
		<main className="flex-1">
			<div className="w-full px-6 py-16 relative">
				<Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className={`absolute top-4 left-2 z-10 h-8 w-8 transition-transform duration-200 hover:bg-accent ${sidebarOpen ? "rotate-0" : "rotate-180"}`}>
					<Menu className="h-4 w-4" />
					<span className="sr-only">Toggle sidebar</span>
				</Button>
				{children}
			</div>
		</main>
	);
}
  