/**
 * PhotoGallerySection Component
 * Job posting photo upload and gallery management section
 * Extracted from large jobs create page for better organization
 */

"use client";

import React, { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Camera, Upload, X, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@components/ui/alert";

export const PhotoGallerySection = ({ formData, onPhotoUpload, onPhotoRemove, errors = {} }) => {
	const onDrop = useCallback(
		(acceptedFiles) => {
			// Filter for image files only
			const imageFiles = acceptedFiles.filter((file) => file.type.startsWith("image/"));

			if (imageFiles.length > 0) {
				onPhotoUpload(imageFiles);
			}
		},
		[onPhotoUpload]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
		},
		maxFiles: 10,
		maxSize: 5 * 1024 * 1024, // 5MB
	});

	const photos = formData.photos || [];

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Camera className="w-5 h-5" />
					<span>Photo Gallery</span>
				</CardTitle>
				<CardDescription>Add photos to help professionals understand your project better</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Photo Grid */}
					{photos.length > 0 && (
						<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
							{photos.map((photo, index) => (
								<div key={photo.id || index} className="relative group aspect-square">
									<div className="absolute inset-0 flex items-center justify-center transition-opacity rounded-lg opacity-0 bg-black/40 group-hover:opacity-100">
										<Button type="button" variant="destructive" size="sm" onClick={() => onPhotoRemove(index)} className="text-white">
											<X className="w-4 h-4" />
										</Button>
									</div>
									<Image src={photo.preview || photo.url} alt={`Project photo ${index + 1}`} fill className="object-cover rounded-lg" />
									{photo.uploading && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
											<div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}
								</div>
							))}
						</div>
					)}

					{/* Upload Area */}
					<div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/40"}`}>
						<input {...getInputProps()} />
						<Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

						{isDragActive ? (
							<div>
								<h3 className="text-lg font-medium text-primary">Drop photos here</h3>
								<p className="text-primary/70">Release to upload your images</p>
							</div>
						) : (
							<div>
								<h3 className="text-lg font-medium">Upload Project Photos</h3>
								<p className="text-muted-foreground mb-4">Drag and drop your images here, or click to browse</p>
								<Button type="button" variant="outline">
									<Upload className="w-4 h-4 mr-2" />
									Choose Files
								</Button>
							</div>
						)}
					</div>

					{/* Upload Guidelines */}
					<div className="text-sm text-muted-foreground space-y-1">
						<p>• Supported formats: JPG, PNG, GIF, WebP</p>
						<p>• Maximum file size: 5MB per image</p>
						<p>• Maximum 10 images total</p>
						<p>• High-quality images help attract better professionals</p>
					</div>

					{/* Photo Count Indicator */}
					{photos.length > 0 && (
						<div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
							<span className="text-sm font-medium">
								{photos.length} photo{photos.length !== 1 ? "s" : ""} uploaded
							</span>
							<span className="text-sm text-muted-foreground">{10 - photos.length} remaining</span>
						</div>
					)}

					{/* Validation Errors */}
					{errors.photos && (
						<Alert variant="destructive">
							<AlertTriangle className="h-4 w-4" />
							<AlertDescription>{errors.photos}</AlertDescription>
						</Alert>
					)}

					{/* Photo Tips */}
					<Alert>
						<Camera className="h-4 w-4" />
						<AlertDescription>
							<strong>Pro tip:</strong> Include photos of the current state, problem areas, reference images, or examples of what you want. This helps professionals provide more accurate quotes and better service.
						</AlertDescription>
					</Alert>
				</div>
			</CardContent>
		</Card>
	);
};
