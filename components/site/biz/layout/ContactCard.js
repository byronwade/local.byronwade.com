import { Phone, Mail, Link as LinkIcon, MapPin, Star } from "react-feather";
import { Button } from "@components/ui/button";
import { Separator } from "@components/ui/separator";
import Link from "next/link";

export function ContactCard() {
	return (
		<div className="p-4 rounded-lg bg-primary-foreground/10 md:p-6">
			<h2 className="mb-2 text-lg font-semibold">Contact</h2>
			<div className="space-y-2">
				<div className="flex items-center gap-2">
					<Phone className="w-5 h-5" />
					<span>555-555-5555</span>
				</div>
				<div className="flex items-center gap-2">
					<Mail className="w-5 h-5" />
					<span>info@acmewebdesign.com</span>
				</div>
				<div className="flex items-center gap-2">
					<LinkIcon className="w-5 h-5" />
					<Link href="#" prefetch={false}>
						acmewebdesign.com
					</Link>
				</div>
				<div className="flex items-center gap-2">
					<MapPin className="w-5 h-5" />
					<span>123 Main St, Anytown USA</span>
				</div>
			</div>
			<Separator className="my-4 bg-gray-400" />
			<div className="space-y-2">
				<h3 className="text-base font-semibold">Reviews</h3>
				<div className="flex items-center gap-2">
					<Star className="w-5 h-5 text-yellow-500" />
					<span>4.8 (123 reviews)</span>
				</div>
				<Button className="w-full">Leave a Review</Button>
			</div>
		</div>
	);
}
