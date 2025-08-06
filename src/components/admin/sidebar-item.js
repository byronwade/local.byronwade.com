// components/SidebarItem.js
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@utils";

export default function SidebarItem({ href, text, className }) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link href={href} className={cn("flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors", "hover:bg-accent hover:text-accent-foreground", "focus:bg-accent focus:text-accent-foreground focus:outline-none", isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground", className)}>
			{text}
		</Link>
	);
}

