// components/SidebarItem.js
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarItem({ href, text, className }) {
	const pathname = usePathname();
	const isActive = pathname.startsWith(href);

	return (
		<Link href={href} className={`block py-1 px-2 text-sm text-right rounded-md ${isActive ? "bg-blue-200 text-brand" : "text-gray-600"} ${className}`}>
			{text}
		</Link>
	);
}
