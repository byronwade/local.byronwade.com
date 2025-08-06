/**
 * MediaSection Component
 * Handles media gallery uploads and management
 * Extracted from the main business profile page for better modularity
 */

"use client";

import React from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Upload, Image } from "lucide-react";

const MediaSection = ({ profile, setProfile, handleSaveProfile, fileInputRef }) => {
	const handleMediaUpload = () => {
		// Handle media upload logic
		if (fileInputRef.current) {
			fileInputRef.current.setAttribute("data-upload-type", "media");
			fileInputRef.current.click();
		}
	};

	return (
		<>
			{/* Media Gallery Card */}
			<Card suppressHydrationWarning>
				<CardHeader>
					<CardTitle>Media Gallery</CardTitle>
					<CardDescription>Upload photos to showcase your work and business.</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-8 text-center rounded-lg border-2 border-dashed border-border">
						<Image className="mx-auto mb-4 w-12 h-12 text-muted-foreground" alt="Upload icon" />
						<h3 className="mb-2 text-lg font-medium">Upload Photos</h3>
						<p className="mb-4 text-muted-foreground">Drag and drop your images here, or click to browse</p>
						<Button variant="outline" onClick={handleMediaUpload}>
							<Upload className="mr-2 w-4 h-4" />
							Choose Files
						</Button>
						<input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" />
					</div>
					<p className="text-xs text-muted-foreground">Supported formats: JPG, PNG, WebP. Maximum file size: 5MB each.</p>

					{/* Existing Media Grid (if any) */}
					{profile.mediaGallery && profile.mediaGallery.length > 0 && (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
							{profile.mediaGallery.map((media, index) => (
								<div key={index} className="relative group">
									<img src={media.url} alt={media.caption || `Gallery image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
									<div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
										<Button
											variant="destructive"
											size="sm"
											onClick={() => {
												// Remove media item
												const updatedGallery = profile.mediaGallery.filter((_, i) => i !== index);
												setProfile((prev) => ({ ...prev, mediaGallery: updatedGallery }));
											}}
										>
											Remove
										</Button>
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
				<CardFooter className="px-6 py-4 border-t">
					<Button onClick={handleSaveProfile}>Save Changes</Button>
				</CardFooter>
			</Card>
		</>
	);
};

export default MediaSection;
