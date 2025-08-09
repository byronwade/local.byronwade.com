import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Upload, Trash2, Play, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function MediaSection({ profile, setProfile, isEditing, fileInputRef, handlePhotoUpload }) {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<ImageIcon size={20} className="text-gray-500" />
						<span>Photos</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{profile.photos.map((photo, index) => (
								<div key={index} className="relative aspect-square w-full group">
									<Image src={photo} alt={`Photo ${index + 1}`} layout="fill" className="object-cover rounded-lg" />
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
										<button onClick={() => setProfile({ ...profile, photos: profile.photos.filter((_, i) => i !== index) })} className="text-white p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
											<Trash2 size={20} />
										</button>
									</div>
								</div>
							))}
							<div className="relative aspect-square w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => fileInputRef.current.click()}>
								<div className="text-center">
									<Upload size={32} className="mx-auto text-gray-400" />
									<p className="mt-2 text-sm text-gray-500">Upload Photo</p>
								</div>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
							{profile.photos.map((photo, index) => (
								<div key={index} className="relative aspect-square w-full">
									<Image src={photo} alt={`Photo ${index + 1}`} layout="fill" className="object-cover rounded-lg" />
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<Play size={20} className="text-gray-500" />
						<span>Videos</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					{isEditing ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{profile.videos.map((video, index) => (
								<div key={index} className="relative aspect-video w-full group">
									<video src={video} className="w-full h-full object-cover rounded-lg" />
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
										<Play size={48} className="text-white" />
									</div>
									{isEditing && (
										<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
											<button onClick={() => setProfile({ ...profile, videos: profile.videos.filter((_, i) => i !== index) })} className="text-white p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
												<Trash2 size={20} />
											</button>
										</div>
									)}
								</div>
							))}
							{isEditing && (
								<div className="relative aspect-video w-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
									<div className="text-center">
										<Upload size={32} className="mx-auto text-gray-400" />
										<p className="mt-2 text-sm text-gray-500">Upload Video</p>
									</div>
								</div>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{profile.videos.map((video, index) => (
								<div key={index} className="relative aspect-video w-full">
									<video src={video} className="w-full h-full object-cover rounded-lg" />
									<div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
										<Play size={48} className="text-white" />
									</div>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
