import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Handshake } from "lucide-react";

export default function PartnershipsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Handshake className="w-5 h-5" />
					<span>Partnerships</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.partnerships.map((partner, index) => (
						<div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
							<img src={partner.logo} alt={partner.name} className="w-12 h-12 rounded bg-white object-contain" />
							<div className="flex-1">
								<h4 className="font-medium text-foreground">{partner.name}</h4>
								<p className="text-sm text-muted-foreground">{partner.type}</p>
								<p className="text-sm text-muted-foreground">{partner.description}</p>
								{partner.website && (
									<a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
										{partner.website}
									</a>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
