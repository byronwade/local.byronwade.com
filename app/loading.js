import { Loader2, Sparkles } from "lucide-react";

export default function Loading() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
			<div className="text-center space-y-8">
				{/* Loading Animation */}
				<div className="relative">
					<div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto">
						<Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
					</div>
					<div className="absolute -top-2 -right-2">
						<Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
					</div>
				</div>

				{/* Loading Text */}
				<div className="space-y-2">
					<h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
					<p className="text-gray-600">Getting everything ready for you</p>
				</div>

				{/* Progress Dots */}
				<div className="flex items-center justify-center space-x-2">
					{[0, 1, 2].map((i) => (
						<div
							key={i}
							className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
							style={{
								animationDelay: `${i * 0.2}s`,
								animationDuration: "1s",
							}}
						/>
					))}
				</div>

				{/* Loading Messages */}
				<div className="text-sm text-gray-500 space-y-1">
					<p className="animate-fade-in">Loading your local business directory...</p>
				</div>
			</div>
		</div>
	);
}
