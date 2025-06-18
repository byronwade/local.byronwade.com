// components/SidebarSection.js
export default function SidebarSection({ title, children }) {
	return (
		<div>
			{title && <h2 className="mb-3 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</h2>}
			{children}
		</div>
	);
}
