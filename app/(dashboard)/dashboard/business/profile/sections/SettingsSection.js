import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Switch } from "@components/ui/switch";
import { Settings } from "lucide-react";

export default function SettingsSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Settings className="w-5 h-5" />
					<span>Profile Settings</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h4 className="font-medium text-foreground">Profile Visibility</h4>
							<p className="text-sm text-muted-foreground">Make your profile visible to customers</p>
						</div>
						<Switch defaultChecked />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
