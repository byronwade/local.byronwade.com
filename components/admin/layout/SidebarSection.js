// components/SidebarSection.js
export default function SidebarSection({ title, children }) {
	return (
		<div>
			{title && <h2 className="mb-2 text-sm font-bold text-right text-gray-600">{title}</h2>}
			<ul className="space-y-1">{children}</ul>
		</div>
	);
}
