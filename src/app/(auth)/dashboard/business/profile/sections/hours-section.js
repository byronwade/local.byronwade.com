import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Switch } from "@components/ui/switch";
import { Clock } from "lucide-react";

export default function HoursSection({ profile, setProfile, isEditing }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Clock className="w-5 h-5" />
					<span>Business Hours</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{Object.entries(profile.hours).map(([day, hours]) => {
						if (day === "holidays" || day === "emergency") return null;

						return (
							<div key={day} className="flex items-center justify-between p-3 border border-border rounded-lg">
								<div className="flex items-center space-x-3">
									<Switch
										checked={!hours.closed}
										onCheckedChange={(checked) => {
											setProfile((prev) => ({
												...prev,
												hours: {
													...prev.hours,
													[day]: { ...hours, closed: !checked },
												},
											}));
										}}
										disabled={!isEditing}
									/>
									<span className="font-medium capitalize w-20 text-foreground">{day}</span>
								</div>
								{hours.closed ? (
									<span className="text-muted-foreground">Closed</span>
								) : (
									<div className="flex items-center space-x-2">
										{isEditing ? (
											<>
												<Input
													value={hours.open}
													onChange={(e) => {
														setProfile((prev) => ({
															...prev,
															hours: {
																...prev.hours,
																[day]: { ...hours, open: e.target.value },
															},
														}));
													}}
													className="w-24"
												/>
												<span className="text-muted-foreground">to</span>
												<Input
													value={hours.close}
													onChange={(e) => {
														setProfile((prev) => ({
															...prev,
															hours: {
																...prev.hours,
																[day]: { ...hours, close: e.target.value },
															},
														}));
													}}
													className="w-24"
												/>
											</>
										) : (
											<span className="text-foreground">
												{hours.open} - {hours.close}
											</span>
										)}
									</div>
								)}
							</div>
						);
					})}

					{/* Special Information */}
					{profile.hours.holidays && (
						<div className="p-3 border border-border rounded-lg">
							<h4 className="font-medium text-foreground mb-1">Holiday Hours</h4>
							<p className="text-sm text-muted-foreground">{profile.hours.holidays}</p>
						</div>
					)}

					{profile.hours.emergency && (
						<div className="p-3 border border-border rounded-lg">
							<h4 className="font-medium text-foreground mb-1">Emergency Service</h4>
							<p className="text-sm text-muted-foreground">{profile.hours.emergency}</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
