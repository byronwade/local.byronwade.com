// components/Main.js
export default function Main({ children }) {
	return (
		<main className="flex-1 bg-white text-black rounded-tl-[4em]">
			<div className="p-8">{children}</div>
		</main>
	);
}
