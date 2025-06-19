import React from "react";
import { Button } from "@components/ui/button";
import { Badge } from "@components/ui/badge";
import { Zap, Clock, Video, Phone, ChevronLeft, ChevronRight, Globe } from "lucide-react";

export default function Availability({ business }) {
	return (
		<section className="scroll-mt-20 sm:scroll-mt-24 lg:scroll-mt-32">
			<div className="mb-8">
				<h2 className="flex items-center mb-2 text-2xl font-bold text-foreground">
					<Zap className="w-6 h-6 mr-3 text-primary" />
					Live Availability & Booking
				</h2>
				<div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary to-primary/50"></div>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Left Panel - Business Info & Status */}
				<div className="lg:col-span-1">
					<div className="p-6 space-y-6 border rounded-xl bg-card border-border">
						{/* Business Avatar & Info */}
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 overflow-hidden bg-blue-600 rounded-lg">
								<div className="flex items-center justify-center w-full h-full text-xl font-bold text-white">
									{business?.name
										? business.name
												.split(" ")
												.map((word) => word[0])
												.join("")
												.slice(0, 2)
										: "AC"}
								</div>
							</div>
							<div>
								<h3 className="font-semibold text-foreground">{business.name}</h3>
								<p className="text-sm text-muted-foreground">Client Check-in</p>
							</div>
						</div>

						{/* Service Details */}
						<div className="space-y-3">
							<div className="flex items-center gap-2">
								<Clock className="w-4 h-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">30 min</span>
							</div>
							<div className="flex items-center gap-2">
								<Video className="w-4 h-4 text-muted-foreground" />
								<span className="text-sm text-muted-foreground">Zoom</span>
							</div>
						</div>

						{/* Live Status */}
						<div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
								<span className="text-sm font-medium text-green-700 dark:text-green-400">LIVE - Available Now</span>
							</div>
							<p className="mt-1 text-xs text-green-600 dark:text-green-500">45 minutes response time</p>
						</div>

						{/* Emergency Service */}
						<div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
							<h4 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-400">Emergency Service</h4>
							<p className="mb-3 text-xs text-red-600 dark:text-red-500">24/7 immediate response</p>
							<Button size="sm" className="w-full text-white bg-red-600 hover:bg-red-700">
								<Phone className="w-3 h-3 mr-2" />
								Call Emergency: {business?.phone?.replace(/[()]/g, "") || "(706) 555-0123"}
							</Button>
						</div>
					</div>
				</div>

				{/* Center Panel - Calendar & Time Selection */}
				<div className="lg:col-span-2">
					<div className="p-6 border rounded-xl bg-card border-border">
						{/* Calendar Header */}
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-foreground">Select a Date & Time</h3>
							<div className="flex items-center gap-2">
								<button className="p-2 rounded-lg hover:bg-muted">
									<ChevronLeft className="w-4 h-4 text-muted-foreground" />
								</button>
								<span className="px-3 py-1 text-sm font-medium text-foreground">July 2024</span>
								<button className="p-2 rounded-lg hover:bg-muted">
									<ChevronRight className="w-4 h-4 text-muted-foreground" />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{/* Calendar */}
							<div>
								<div className="grid grid-cols-7 gap-1 mb-4">
									{["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
										<div key={day} className="p-2 text-xs font-medium text-center text-muted-foreground">
											{day}
										</div>
									))}
								</div>
								<div className="grid grid-cols-7 gap-1">
									{[30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3].map((date, index) => (
										<button
											key={index}
											className={`
												p-2 text-sm font-medium rounded-lg transition-all text-center
												${date === 22 ? "bg-blue-600 text-white" : date > 30 ? "text-muted-foreground/50 hover:bg-muted/50" : "text-foreground hover:bg-muted"}
												${[16, 17, 19, 23, 24, 25].includes(date) && date <= 30 ? "text-blue-600 font-semibold" : ""}
											`}
										>
											{date}
										</button>
									))}
								</div>

								{/* Time Zone */}
								<div className="pt-4 mt-4 border-t border-border">
									<div className="flex items-center gap-2">
										<Globe className="w-4 h-4 text-muted-foreground" />
										<span className="text-sm text-muted-foreground">Eastern time - US & Canada</span>
									</div>
								</div>
							</div>

							{/* Time Slots */}
							<div>
								<div className="mb-4">
									<h4 className="text-sm font-semibold text-foreground">Monday, July 22</h4>
								</div>
								<div className="space-y-3">
									{["10:00am", "1:00pm", "2:30pm", "4:00pm"].map((time, index) => (
										<button
											key={time}
											className={`
												w-full p-3 text-left rounded-lg border-2 transition-all
												${index === 0 ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" : "border-border hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"}
											`}
										>
											<div className="text-sm font-medium text-foreground">{time}</div>
										</button>
									))}

									{/* Available Slot with Special Styling */}
									<div className="relative">
										<button className="w-full p-3 text-left transition-all border-2 border-blue-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
											<div className="text-sm font-medium text-blue-700 dark:text-blue-300">11:00am</div>
										</button>
										<Button size="sm" className="absolute text-xs text-white bg-blue-600 top-2 right-2 h-7 hover:bg-blue-700">
											Confirm
										</Button>
									</div>
								</div>

								{/* Video Consultation */}
								<div className="p-4 mt-6 rounded-lg bg-muted/50">
									<div className="flex items-center justify-between mb-2">
										<h4 className="text-sm font-semibold text-foreground">Video Consultation</h4>
										<Badge variant="outline" className="text-blue-600 border-blue-200 dark:text-blue-400 dark:border-blue-800">
											Free
										</Badge>
									</div>
									<p className="text-xs text-muted-foreground">15-minute initial consultation to discuss your project</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
