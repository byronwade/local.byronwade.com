import React from "react";
import { useState, useRef } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Textarea } from "@components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Calendar, Clock, MapPin, Phone, Mail, Globe, Star, Users, Building, Upload, Plus, X } from "lucide-react";

export default function OverviewSection({ profile, setProfile, isEditing, CategoryIcon, logoInputRef, handleLogoUpload }) {
	return (
		<div className="space-y-6">
			{/* Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<CategoryIcon className="w-5 h-5" />
						<span>Basic Information</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Logo and Cover Photo */}
					<div className="flex items-start space-x-6">
						<div className="flex flex-col items-center space-y-2">
							<Avatar className="w-24 h-24">
								<AvatarImage src={profile.logo} />
								<AvatarFallback className="text-lg">
									{profile.name
										.split(" ")
										.map((word) => word[0])
										.join("")}
								</AvatarFallback>
							</Avatar>
							{isEditing && (
								<Button size="sm" variant="outline" onClick={() => logoInputRef.current?.click()}>
									<Upload className="w-4 h-4 mr-1" />
									Upload Logo
								</Button>
							)}
							<input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
						</div>
						<div className="flex-1 space-y-4">
							{isEditing ? (
								<>
									<Input value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Business Name" className="text-xl font-bold" />
									<Input value={profile.tagline} onChange={(e) => setProfile((prev) => ({ ...prev, tagline: e.target.value }))} placeholder="Tagline" className="text-muted-foreground" />
									<Textarea value={profile.description} onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))} placeholder="Business Description" rows={4} />
								</>
							) : (
								<>
									<h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
									<p className="text-muted-foreground">{profile.tagline}</p>
									<p className="text-sm text-muted-foreground">{profile.description}</p>
								</>
							)}
						</div>
					</div>

					{/* Contact Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label className="text-sm font-medium">Phone</Label>
							{isEditing ? (
								<Input value={profile.phone} onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone Number" />
							) : (
								<div className="flex items-center space-x-2">
									<Phone className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.phone}</span>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Email</Label>
							{isEditing ? (
								<Input value={profile.email} onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email Address" />
							) : (
								<div className="flex items-center space-x-2">
									<Mail className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.email}</span>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Website</Label>
							{isEditing ? (
								<Input value={profile.website} onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))} placeholder="Website URL" />
							) : (
								<div className="flex items-center space-x-2">
									<Globe className="w-4 h-4 text-muted-foreground" />
									<a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
										{profile.website}
									</a>
								</div>
							)}
						</div>
						<div className="space-y-2">
							<Label className="text-sm font-medium">Address</Label>
							{isEditing ? (
								<Input value={profile.address} onChange={(e) => setProfile((prev) => ({ ...prev, address: e.target.value }))} placeholder="Business Address" />
							) : (
								<div className="flex items-center space-x-2">
									<MapPin className="w-4 h-4 text-muted-foreground" />
									<span className="text-foreground">{profile.address}</span>
								</div>
							)}
						</div>
					</div>

					{/* Service Areas */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Service Areas</Label>
						{isEditing ? (
							<div className="flex flex-wrap gap-2">
								{profile.serviceAreas.map((area, index) => (
									<Badge key={index} variant="outline" className="flex items-center space-x-1">
										<span>{area}</span>
										<X
											className="w-3 h-3 cursor-pointer"
											onClick={() => {
												const newAreas = profile.serviceAreas.filter((_, i) => i !== index);
												setProfile((prev) => ({ ...prev, serviceAreas: newAreas }));
											}}
										/>
									</Badge>
								))}
								<Button size="sm" variant="outline">
									<Plus className="w-3 h-3 mr-1" />
									Add Area
								</Button>
							</div>
						) : (
							<div className="flex flex-wrap gap-2">
								{profile.serviceAreas.map((area, index) => (
									<Badge key={index} variant="outline">
										{area}
									</Badge>
								))}
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Business Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Star className="w-5 h-5 text-yellow-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.rating}</div>
								<div className="text-sm text-muted-foreground">{profile.reviewCount} reviews</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Users className="w-5 h-5 text-blue-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.employees}</div>
								<div className="text-sm text-muted-foreground">Employees</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Calendar className="w-5 h-5 text-green-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.yearEstablished}</div>
								<div className="text-sm text-muted-foreground">Established</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center space-x-2">
							<Building className="w-5 h-5 text-purple-500" />
							<div>
								<div className="text-2xl font-bold text-foreground">{profile.verifications.length}</div>
								<div className="text-sm text-muted-foreground">Verifications</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
