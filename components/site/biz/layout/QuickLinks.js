import { Button } from "@/components/ui/button";
import { Star, Camera, Share2, Bookmark, UserPlus, MapPin, Phone } from "react-feather";

export function QuickLinks() {
	return (
		<section className="py-4">
			<div className="flex flex-wrap gap-4">
				<Button className="flex items-center gap-2" variant="outline">
					<Star className="w-5 h-5" />
					Write a Review
				</Button>
				<Button className="flex items-center gap-2" variant="outline">
					<Camera className="w-5 h-5" />
					Add Photo
				</Button>
				<Button className="flex items-center gap-2" variant="outline">
					<Share2 className="w-5 h-5" />
					Share
				</Button>
				<Button className="flex items-center gap-2" variant="outline">
					<Bookmark className="w-5 h-5" />
					Save as Bookmark
				</Button>
				<Button className="flex items-center gap-2" variant="outline">
					<UserPlus className="w-5 h-5" />
					Follow
				</Button>
				{/* Additional useful buttons can be added here */}
				<Button className="flex items-center gap-2" variant="outline">
					<MapPin className="w-5 h-5" />
					Get Directions
				</Button>
				<Button className="flex items-center gap-2" variant="outline">
					<Phone className="w-5 h-5" />
					Contact Us
				</Button>
			</div>
		</section>
	);
}
