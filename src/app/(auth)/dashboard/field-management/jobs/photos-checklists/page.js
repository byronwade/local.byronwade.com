"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Input } from "@components/ui/input";
import { Textarea } from "@components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@components/ui/dialog";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import { Progress } from "@components/ui/progress";
import { Camera, Image, CheckCircle, Circle, Download, Share2, Trash2, Eye, Calendar, MapPin, User, Clock, Plus, Edit3, AlertTriangle } from "lucide-react";

// Mock data for jobs with photos and checklists
const mockJobs = [
	{
		id: "JOB001",
		title: "HVAC Maintenance - Downtown Office",
		customer: "TechCorp Inc.",
		address: "123 Business Ave, Downtown, CA 90210",
		technician: "Mike Johnson",
		date: "2024-01-15",
		time: "09:00 - 12:00",
		status: "in_progress",
		priority: "high",
		photos: [
			{
				id: "P001",
				url: "/api/placeholder/300/200",
				caption: "Main HVAC unit before maintenance",
				timestamp: "2024-01-15T09:15:00Z",
				category: "before",
				location: "Roof access",
			},
			{
				id: "P002",
				url: "/api/placeholder/300/200",
				caption: "Filter replacement in progress",
				timestamp: "2024-01-15T10:30:00Z",
				category: "during",
				location: "Mechanical room",
			},
			{
				id: "P003",
				url: "/api/placeholder/300/200",
				caption: "Completed maintenance with new filter",
				timestamp: "2024-01-15T11:45:00Z",
				category: "after",
				location: "Mechanical room",
			},
		],
		checklist: {
			id: "CL001",
			name: "HVAC Maintenance Checklist",
			categories: [
				{
					name: "Pre-Service Inspection",
					items: [
						{ id: "1", text: "Photograph existing equipment condition", completed: true, required: true },
						{ id: "2", text: "Check system operation before service", completed: true, required: true },
						{ id: "3", text: "Verify customer requirements", completed: true, required: false },
						{ id: "4", text: "Ensure safety equipment available", completed: true, required: true },
					],
				},
				{
					name: "Service Tasks",
					items: [
						{ id: "5", text: "Replace air filters", completed: true, required: true },
						{ id: "6", text: "Clean evaporator coils", completed: true, required: true },
						{ id: "7", text: "Check refrigerant levels", completed: false, required: true },
						{ id: "8", text: "Inspect electrical connections", completed: false, required: true },
						{ id: "9", text: "Lubricate moving parts", completed: false, required: false },
					],
				},
				{
					name: "Post-Service Verification",
					items: [
						{ id: "10", text: "Test system operation", completed: false, required: true },
						{ id: "11", text: "Document final readings", completed: false, required: true },
						{ id: "12", text: "Take completion photos", completed: false, required: true },
						{ id: "13", text: "Customer sign-off", completed: false, required: true },
					],
				},
			],
		},
	},
	{
		id: "JOB002",
		title: "Plumbing Repair - Kitchen Sink",
		customer: "Sarah Miller",
		address: "456 Oak Street, Residential, CA 90211",
		technician: "David Chen",
		date: "2024-01-15",
		time: "14:00 - 16:00",
		status: "scheduled",
		priority: "medium",
		photos: [],
		checklist: {
			id: "CL002",
			name: "Plumbing Repair Checklist",
			categories: [
				{
					name: "Initial Assessment",
					items: [
						{ id: "1", text: "Document problem area with photos", completed: false, required: true },
						{ id: "2", text: "Test water pressure", completed: false, required: true },
						{ id: "3", text: "Check for leaks", completed: false, required: true },
					],
				},
				{
					name: "Repair Work",
					items: [
						{ id: "4", text: "Replace faulty components", completed: false, required: true },
						{ id: "5", text: "Apply sealants as needed", completed: false, required: true },
						{ id: "6", text: "Test repairs", completed: false, required: true },
					],
				},
			],
		},
	},
];

export default function PhotosChecklists() {
	const [selectedJob, setSelectedJob] = useState(mockJobs[0]);
	const [activeTab, setActiveTab] = useState("photos");
	const [selectedPhoto, setSelectedPhoto] = useState(null);
	const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
	const [checklistDialogOpen, setChecklistDialogOpen] = useState(false);
	const [newPhotoCaption, setNewPhotoCaption] = useState("");
	const [newPhotoCategory, setNewPhotoCategory] = useState("during");
	const fileInputRef = useRef(null);

	// Calculate checklist completion
	const getChecklistCompletion = (checklist) => {
		const allItems = checklist.categories.flatMap((cat) => cat.items);
		const completedItems = allItems.filter((item) => item.completed);
		return {
			completed: completedItems.length,
			total: allItems.length,
			percentage: Math.round((completedItems.length / allItems.length) * 100),
		};
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "completed":
				return "bg-green-500";
			case "in_progress":
				return "bg-blue-500";
			case "scheduled":
				return "bg-orange-500";
			default:
				return "bg-gray-500";
		}
	};

	const getPriorityColor = (priority) => {
		switch (priority) {
			case "high":
				return "border-red-500";
			case "medium":
				return "border-orange-500";
			case "low":
				return "border-green-500";
			default:
				return "border-gray-300";
		}
	};

	const handlePhotoUpload = (event) => {
		const file = event.target.files[0];
		if (file) {
			// In a real app, you would upload to your storage service
			const newPhoto = {
				id: `P${Date.now()}`,
				url: URL.createObjectURL(file),
				caption: newPhotoCaption || `Photo taken on ${new Date().toLocaleDateString()}`,
				timestamp: new Date().toISOString(),
				category: newPhotoCategory,
				location: "Current location",
			};

			// Update the selected job's photos
			setSelectedJob((prev) => ({
				...prev,
				photos: [...prev.photos, newPhoto],
			}));

			setUploadDialogOpen(false);
			setNewPhotoCaption("");
			setNewPhotoCategory("during");
		}
	};

	const toggleChecklistItem = (categoryIndex, itemIndex) => {
		setSelectedJob((prev) => {
			const updated = { ...prev };
			updated.checklist.categories[categoryIndex].items[itemIndex].completed = !updated.checklist.categories[categoryIndex].items[itemIndex].completed;
			return updated;
		});
	};

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold">Job Photos & Checklists</h1>
					<p className="text-muted-foreground">Manage photos and completion checklists for active jobs</p>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" size="sm">
						<Download className="w-4 h-4 mr-2" />
						Export Report
					</Button>
					<Button>
						<Camera className="w-4 h-4 mr-2" />
						Take Photo
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Job Selection Sidebar */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="text-lg">Active Jobs</CardTitle>
							<CardDescription>Select a job to view photos and checklists</CardDescription>
						</CardHeader>
						<CardContent className="p-0">
							<div className="space-y-2">
								{mockJobs.map((job) => {
									const completion = getChecklistCompletion(job.checklist);
									return (
										<div key={job.id} className={`p-4 cursor-pointer border-l-4 hover:bg-accent/50 transition-colors ${selectedJob.id === job.id ? "bg-accent" : ""} ${getPriorityColor(job.priority)}`} onClick={() => setSelectedJob(job)}>
											<div className="flex justify-between items-start mb-2">
												<div className="flex-1">
													<h4 className="font-medium text-sm">{job.title}</h4>
													<p className="text-xs text-muted-foreground mt-1">{job.customer}</p>
												</div>
												<Badge className={getStatusColor(job.status)} variant="secondary">
													{job.status.replace("_", " ")}
												</Badge>
											</div>

											<div className="space-y-2 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<Calendar className="w-3 h-3" />
													{job.date} • {job.time}
												</div>
												<div className="flex items-center gap-1">
													<User className="w-3 h-3" />
													{job.technician}
												</div>
												<div className="flex items-center gap-1">
													<Image className="w-3 h-3" />
													{job.photos.length} photos
												</div>
												<div className="flex items-center justify-between">
													<span>
														Checklist: {completion.completed}/{completion.total}
													</span>
													<span className="font-medium">{completion.percentage}%</span>
												</div>
												<Progress value={completion.percentage} className="h-1" />
											</div>
										</div>
									);
								})}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<div className="lg:col-span-2">
					{selectedJob && (
						<Card>
							<CardHeader>
								<div className="flex justify-between items-start">
									<div>
										<CardTitle>{selectedJob.title}</CardTitle>
										<CardDescription>
											<div className="flex items-center gap-4 mt-2 text-sm">
												<div className="flex items-center gap-1">
													<MapPin className="w-4 h-4" />
													{selectedJob.address}
												</div>
												<div className="flex items-center gap-1">
													<User className="w-4 h-4" />
													{selectedJob.technician}
												</div>
												<div className="flex items-center gap-1">
													<Clock className="w-4 h-4" />
													{selectedJob.date} • {selectedJob.time}
												</div>
											</div>
										</CardDescription>
									</div>
									<Badge className={getStatusColor(selectedJob.status)} variant="secondary">
										{selectedJob.status.replace("_", " ")}
									</Badge>
								</div>
							</CardHeader>

							<CardContent>
								<Tabs value={activeTab} onValueChange={setActiveTab}>
									<TabsList className="grid w-full grid-cols-2">
										<TabsTrigger value="photos" className="flex items-center gap-2">
											<Image className="w-4 h-4" />
											Photos ({selectedJob.photos.length})
										</TabsTrigger>
										<TabsTrigger value="checklist" className="flex items-center gap-2">
											<CheckCircle className="w-4 h-4" />
											Checklist ({getChecklistCompletion(selectedJob.checklist).percentage}%)
										</TabsTrigger>
									</TabsList>

									{/* Photos Tab */}
									<TabsContent value="photos" className="space-y-4">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold">Job Photos</h3>
											<Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
												<DialogTrigger asChild>
													<Button size="sm">
														<Plus className="w-4 h-4 mr-2" />
														Add Photo
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Upload New Photo</DialogTitle>
														<DialogDescription>Add a photo for this job with details</DialogDescription>
													</DialogHeader>

													<div className="space-y-4">
														<div>
															<Label htmlFor="photo-upload">Select Photo</Label>
															<Input id="photo-upload" type="file" accept="image/*" ref={fileInputRef} onChange={handlePhotoUpload} />
														</div>

														<div>
															<Label htmlFor="photo-caption">Caption</Label>
															<Textarea id="photo-caption" placeholder="Describe what this photo shows..." value={newPhotoCaption} onChange={(e) => setNewPhotoCaption(e.target.value)} />
														</div>

														<div>
															<Label htmlFor="photo-category">Category</Label>
															<select id="photo-category" className="w-full p-2 border rounded-md" value={newPhotoCategory} onChange={(e) => setNewPhotoCategory(e.target.value)}>
																<option value="before">Before</option>
																<option value="during">During</option>
																<option value="after">After</option>
																<option value="issue">Issue/Problem</option>
																<option value="solution">Solution</option>
															</select>
														</div>
													</div>

													<DialogFooter>
														<Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
															Cancel
														</Button>
														<Button onClick={() => fileInputRef.current?.click()}>
															<Camera className="w-4 h-4 mr-2" />
															Take Photo
														</Button>
													</DialogFooter>
												</DialogContent>
											</Dialog>
										</div>

										{selectedJob.photos.length === 0 ? (
											<div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
												<Camera className="w-12 h-12 mx-auto text-gray-400 mb-4" />
												<h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
												<p className="text-gray-500 mb-4">Start documenting this job by taking before photos</p>
												<Button onClick={() => setUploadDialogOpen(true)}>
													<Camera className="w-4 h-4 mr-2" />
													Take First Photo
												</Button>
											</div>
										) : (
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
												{selectedJob.photos.map((photo) => (
													<div key={photo.id} className="group relative bg-white rounded-lg border overflow-hidden">
														<div className="aspect-video relative">
															<img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
															<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
															<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
																<div className="flex gap-1">
																	<Button size="sm" variant="secondary" onClick={() => setSelectedPhoto(photo)}>
																		<Eye className="w-3 h-3" />
																	</Button>
																	<Button size="sm" variant="secondary">
																		<Share2 className="w-3 h-3" />
																	</Button>
																	<Button size="sm" variant="secondary">
																		<Trash2 className="w-3 h-3" />
																	</Button>
																</div>
															</div>
														</div>

														<div className="p-3">
															<div className="flex items-center justify-between mb-2">
																<Badge variant="outline" className={photo.category === "before" ? "border-orange-500 text-orange-700" : photo.category === "during" ? "border-blue-500 text-blue-700" : photo.category === "after" ? "border-green-500 text-green-700" : "border-gray-500 text-gray-700"}>
																	{photo.category}
																</Badge>
																<span className="text-xs text-muted-foreground">{new Date(photo.timestamp).toLocaleTimeString()}</span>
															</div>

															<p className="text-sm font-medium mb-1">{photo.caption}</p>
															<p className="text-xs text-muted-foreground flex items-center gap-1">
																<MapPin className="w-3 h-3" />
																{photo.location}
															</p>
														</div>
													</div>
												))}
											</div>
										)}
									</TabsContent>

									{/* Checklist Tab */}
									<TabsContent value="checklist" className="space-y-4">
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold">{selectedJob.checklist.name}</h3>
											<div className="flex items-center gap-4">
												<div className="text-sm text-muted-foreground">
													{getChecklistCompletion(selectedJob.checklist).completed} of {getChecklistCompletion(selectedJob.checklist).total} completed
												</div>
												<Progress value={getChecklistCompletion(selectedJob.checklist).percentage} className="w-24" />
												<Button size="sm" variant="outline">
													<Edit3 className="w-4 h-4 mr-2" />
													Edit
												</Button>
											</div>
										</div>

										<div className="space-y-6">
											{selectedJob.checklist.categories.map((category, categoryIndex) => (
												<div key={category.name} className="space-y-3">
													<div className="flex items-center justify-between">
														<h4 className="font-medium text-base">{category.name}</h4>
														<div className="text-sm text-muted-foreground">
															{category.items.filter((item) => item.completed).length} / {category.items.length}
														</div>
													</div>

													<div className="space-y-2 pl-4 border-l-2 border-gray-200">
														{category.items.map((item, itemIndex) => (
															<div key={item.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${item.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:border-gray-300"}`}>
																<Checkbox id={item.id} checked={item.completed} onCheckedChange={() => toggleChecklistItem(categoryIndex, itemIndex)} />
																<div className="flex-1">
																	<Label htmlFor={item.id} className={`text-sm cursor-pointer ${item.completed ? "line-through text-muted-foreground" : ""}`}>
																		{item.text}
																	</Label>
																	{item.required && (
																		<Badge variant="outline" className="ml-2 text-xs">
																			Required
																		</Badge>
																	)}
																</div>

																{item.completed ? <CheckCircle className="w-5 h-5 text-green-500" /> : item.required ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : <Circle className="w-5 h-5 text-gray-400" />}
															</div>
														))}
													</div>
												</div>
											))}
										</div>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					)}
				</div>
			</div>

			{/* Photo Preview Modal */}
			{selectedPhoto && (
				<Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
					<DialogContent className="max-w-4xl">
						<DialogHeader>
							<DialogTitle>{selectedPhoto.caption}</DialogTitle>
							<DialogDescription>
								{selectedPhoto.category} • {new Date(selectedPhoto.timestamp).toLocaleString()}
							</DialogDescription>
						</DialogHeader>

						<div className="aspect-video">
							<img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full h-full object-contain rounded-md" />
						</div>

						<DialogFooter>
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Download
							</Button>
							<Button variant="outline">
								<Share2 className="w-4 h-4 mr-2" />
								Share
							</Button>
							<Button onClick={() => setSelectedPhoto(null)}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
