import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { DollarSign, Plus, Edit } from "lucide-react";

export default function ServicesSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<DollarSign className="w-5 h-5" />
					<span>Services & Pricing</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.services.map((service, index) => (
						<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex-1">
								<h4 className="font-medium text-foreground">{service.name}</h4>
								<p className="text-sm text-muted-foreground">{service.description}</p>
								<div className="flex items-center space-x-2 mt-2">
									<Badge variant="outline">{service.category}</Badge>
									{service.duration && <span className="text-xs text-muted-foreground">• {service.duration}</span>}
								</div>
							</div>
							<div className="text-right">
								<div className="font-bold text-green-600">{service.price}</div>
								{isEditing && (
									<Button size="sm" variant="outline" className="mt-2">
										<Edit className="w-3 h-3 mr-1" />
										Edit
									</Button>
								)}
							</div>
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Service
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
