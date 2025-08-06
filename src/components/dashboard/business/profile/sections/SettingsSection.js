/**
 * SettingsSection Component
 * Handles notification preferences and privacy settings
 * Extracted from the main business profile page for better modularity
 */

"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Switch } from "@components/ui/switch";
import { Label } from "@components/ui/label";
import { Separator } from "@components/ui/separator";

const SettingsSection = ({ profile, setProfile, handleSaveProfile }) => {
	const updateNotificationSetting = (key, value) => {
		setProfile((prev) => ({
			...prev,
			settings: {
				...prev.settings,
				notifications: {
					...prev.settings.notifications,
					[key]: value,
				},
			},
		}));
	};

	const updatePrivacySetting = (key, value) => {
		setProfile((prev) => ({
			...prev,
			settings: {
				...prev.settings,
				privacy: {
					...prev.settings.privacy,
					[key]: value,
				},
			},
		}));
	};

	return (
		<>
			{/* Notification Settings Card */}
			<Card suppressHydrationWarning>
				<CardHeader>
					<CardTitle>Notification Settings</CardTitle>
					<CardDescription>Configure how you receive notifications.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Email Notifications</Label>
							<p className="text-sm text-muted-foreground">Receive notifications via email</p>
						</div>
						<Switch checked={profile.settings?.notifications?.email || false} onCheckedChange={(checked) => updateNotificationSetting("email", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">SMS Notifications</Label>
							<p className="text-sm text-muted-foreground">Receive notifications via text message</p>
						</div>
						<Switch checked={profile.settings?.notifications?.sms || false} onCheckedChange={(checked) => updateNotificationSetting("sms", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Push Notifications</Label>
							<p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
						</div>
						<Switch checked={profile.settings?.notifications?.push || false} onCheckedChange={(checked) => updateNotificationSetting("push", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Marketing Emails</Label>
							<p className="text-sm text-muted-foreground">Receive promotional and marketing emails</p>
						</div>
						<Switch checked={profile.settings?.notifications?.marketing || false} onCheckedChange={(checked) => updateNotificationSetting("marketing", checked)} />
					</div>
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button onClick={handleSaveProfile}>Save Changes</Button>
				</CardFooter>
			</Card>

			{/* Privacy Settings Card */}
			<Card suppressHydrationWarning>
				<CardHeader>
					<CardTitle>Privacy Settings</CardTitle>
					<CardDescription>Control what information is visible to the public.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Show Phone Number</Label>
							<p className="text-sm text-muted-foreground">Display your phone number publicly</p>
						</div>
						<Switch checked={profile.settings?.privacy?.showPhone || false} onCheckedChange={(checked) => updatePrivacySetting("showPhone", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Show Email Address</Label>
							<p className="text-sm text-muted-foreground">Display your email address publicly</p>
						</div>
						<Switch checked={profile.settings?.privacy?.showEmail || false} onCheckedChange={(checked) => updatePrivacySetting("showEmail", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Show Business Address</Label>
							<p className="text-sm text-muted-foreground">Display your business address publicly</p>
						</div>
						<Switch checked={profile.settings?.privacy?.showAddress || false} onCheckedChange={(checked) => updatePrivacySetting("showAddress", checked)} />
					</div>

					<Separator />

					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Public Profile</Label>
							<p className="text-sm text-muted-foreground">Make your business profile visible to search engines</p>
						</div>
						<Switch checked={profile.settings?.privacy?.publicProfile !== false} onCheckedChange={(checked) => updatePrivacySetting("publicProfile", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Allow Reviews</Label>
							<p className="text-sm text-muted-foreground">Allow customers to leave reviews on your profile</p>
						</div>
						<Switch checked={profile.settings?.privacy?.allowReviews !== false} onCheckedChange={(checked) => updatePrivacySetting("allowReviews", checked)} />
					</div>
					<div className="flex justify-between items-center">
						<div>
							<Label className="text-base font-medium">Show Business Hours</Label>
							<p className="text-sm text-muted-foreground">Display your business hours publicly</p>
						</div>
						<Switch checked={profile.settings?.privacy?.showHours !== false} onCheckedChange={(checked) => updatePrivacySetting("showHours", checked)} />
					</div>
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button onClick={handleSaveProfile}>Save Changes</Button>
				</CardFooter>
			</Card>
		</>
	);
};

export default SettingsSection;
