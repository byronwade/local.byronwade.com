"use client";
import React, { useState, useRef } from "react";
import { Camera, Video, XCircle } from "react-feather";
import Image from "next/image";
import { Button } from "@components/ui/button";

const AddPostForm = ({ onSubmit }) => {
	const [content, setContent] = useState("");
	const [images, setImages] = useState([]);
	const [video, setVideo] = useState(null);

	const imageInputRef = useRef(null);
	const videoInputRef = useRef(null);

	const handleChange = (event) => {
		setContent(event.target.value);
	};

	const handleImageChange = (event) => {
		const files = Array.from(event.target.files);
		if (files.length > 6) {
			alert("You can only upload up to 6 images.");
			return;
		}
		const imagePreviews = files.map((file) => URL.createObjectURL(file));
		setImages(imagePreviews);
	};

	const handleVideoChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			setVideo(URL.createObjectURL(file));
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (content.trim() || images.length || video) {
			onSubmit({ content, images, video });
			setContent(""); // Clear the textarea after submission
			setImages([]); // Clear image previews
			setVideo(null); // Clear video preview
		}
	};

	const triggerImageUpload = () => {
		if (imageInputRef.current) {
			imageInputRef.current.click();
		}
	};

	const triggerVideoUpload = () => {
		if (videoInputRef.current) {
			videoInputRef.current.click();
		}
	};

	return (
		<div className="w-full p-4 bg-white rounded-lg shadow-md dark:bg-gray-800">
			<form onSubmit={handleSubmit}>
				<div className="flex items-start">
					<Image width={100} height={100} className="w-12 h-12 mr-3 rounded-full" src="/placeholder.svg" alt="User avatar" />
					<div className="w-full">
						<textarea className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="What's on your mind?" value={content} onChange={handleChange} />

						<div className="flex items-center justify-between mt-2">
							<div className="flex items-center space-x-2">
								{/* Upload Images Button */}
								<Button className="flex items-center" onClick={triggerImageUpload}>
									<Camera className="w-4 h-4 mr-2" />
									Upload Images
								</Button>
								<input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />

								{/* Upload Video Button */}
								<Button className="flex items-center" onClick={triggerVideoUpload}>
									<Video className="w-4 h-4 mr-2" />
									Upload Video
								</Button>
								<input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoChange} />
							</div>
							{/* Post Button */}
							<Button type="submit" className="text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800">
								Post
							</Button>
						</div>
					</div>
				</div>
				{/* Display image previews */}
				<div className="grid grid-cols-3 gap-2 mt-2">
					{images.map((src, index) => (
						<div key={index} className="relative">
							<Image width={1920} height={1080} src={src} alt={`Preview ${index}`} className="object-cover w-full h-24 rounded-md" />
							<button type="button" className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1" onClick={() => setImages(images.filter((_, i) => i !== index))}>
								<XCircle className="w-4 h-4" />
							</button>
						</div>
					))}
				</div>
				{/* Display video preview */}
				{video && (
					<div className="mt-2">
						<video src={video} controls className="object-cover w-full h-48 rounded-md" />
					</div>
				)}
			</form>
		</div>
	);
};

export default AddPostForm;
