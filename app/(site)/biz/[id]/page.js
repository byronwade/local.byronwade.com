import BizProfileClient from "./BizProfileClient";

export default async function BizProfilePage({ params }) {
	// Await params in the server component
	const resolvedParams = await params;

	return <BizProfileClient resolvedParams={resolvedParams} />;
}
