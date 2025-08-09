import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Users, Plus, Edit, Trash2, Mail, Phone } from "lucide-react";

export default function TeamSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Users className="w-5 h-5" />
					<span>Team</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{profile.team.map((member, index) => (
						<div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
							<div className="flex items-center space-x-4">
								<Avatar className="w-12 h-12">
									<AvatarImage src={member.photo} />
									<AvatarFallback className="text-sm">
										{member.name
											.split(" ")
											.map((word) => word[0])
											.join("")}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<h4 className="font-medium text-foreground">{member.name}</h4>
									<p className="text-sm text-muted-foreground">{member.position}</p>
									<p className="text-sm text-muted-foreground">{member.bio}</p>
									<div className="flex items-center space-x-4 mt-2">
										<div className="flex items-center space-x-1 text-xs text-muted-foreground">
											<Mail className="w-3 h-3" />
											<span>{member.email}</span>
										</div>
										<div className="flex items-center space-x-1 text-xs text-muted-foreground">
											<Phone className="w-3 h-3" />
											<span>{member.phone}</span>
										</div>
									</div>
								</div>
							</div>
							{isEditing && (
								<div className="flex items-center space-x-2">
									<Button size="sm" variant="outline">
										<Edit className="w-3 h-3 mr-1" />
										Edit
									</Button>
									<Button size="sm" variant="outline">
										<Trash2 className="w-3 h-3 mr-1" />
										Delete
									</Button>
								</div>
							)}
						</div>
					))}
					{isEditing && (
						<Button variant="outline" className="w-full">
							<Plus className="w-4 h-4 mr-2" />
							Add Team Member
						</Button>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
