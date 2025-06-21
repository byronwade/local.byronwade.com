import React from "react";
import { useRef } from "react";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Image, Upload, Trash2, Play } from "lucide-react";

export default function MediaSection({ profile, setProfile, isEditing, fileInputRef, handlePhotoUpload }) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<Image className="w-5 h-5" />
					<span>Media Gallery</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{/* Media Items */}
					<div>
						<h4 className="font-medium mb-3 text-foreground">Media Gallery</h4>
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							{profile.media.map((item, index) => (
								<div key={index} className="aspect-square rounded-lg overflow-hidden bg-muted relative group">
									{item.type === "video" ? <video src={item.url} className="w-full h-full object-cover" controls /> : <img src={item.url} alt={item.title} className="w-full h-full object-cover" />}
									{isEditing && (
										<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<Button size="sm" variant="destructive">
												<Trash2 className="w-4 h-4" />
											</Button>
										</div>
									)}
									<div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
										<div className="font-medium">{item.title}</div>
										<div className="text-gray-300">{item.uploadDate}</div>
									</div>
								</div>
							))}
							{isEditing && (
								<Button variant="outline" className="aspect-square flex flex-col items-center justify-center" onClick={() => fileInputRef.current?.click()}>
									<Upload className="w-8 h-8 mb-2" />
									<span className="text-sm">Add Media</span>
								</Button>
							)}
							<input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={handlePhotoUpload} className="hidden" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
