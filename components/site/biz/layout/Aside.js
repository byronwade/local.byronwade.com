import { AppointmentCard } from "@/components/site/biz/layout/AppointmentCard";

export function Aside() {
	return (
		<aside className="hidden ml-4 rounded-lg shadow bg-background md:w-1/3 md:block">
			<AppointmentCard />
		</aside>
	);
}
