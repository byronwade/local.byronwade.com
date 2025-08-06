import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@components/ui/popover";
import { ThumbsUp, Heart, Smile, Frown, Meh, ThumbsDown } from "react-feather";

const reactionsIcons = {
	thumbsUp: ThumbsUp,
	heart: Heart,
	smile: Smile,
	frown: Frown,
	meh: Meh,
	thumbsDown: ThumbsDown,
};

const reactionColors = {
	thumbsUp: "bg-blue-500 text-white",
	heart: "bg-red-500 text-white",
	smile: "bg-yellow-500 text-white",
	frown: "bg-gray-500 text-white",
	meh: "bg-green-500 text-white",
	thumbsDown: "bg-purple-500 text-white",
};

const ReactionPopover = ({ handleReactionClick }) => {
	return (
		<Popover>
			<PopoverTrigger asChild>
				<button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500">
					<ThumbsUp className="w-5 h-5 mr-1" /> Like
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-auto px-2 py-2 bg-white rounded shadow">
				<div className="flex justify-around">
					{Object.keys(reactionsIcons).map((reaction) => {
						const Icon = reactionsIcons[reaction];
						return (
							<button key={reaction} onClick={() => handleReactionClick(reaction)} className={`p-1 rounded-full ${reactionColors[reaction]}`}>
								<Icon className="w-4 h-4" />
							</button>
						);
					})}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ReactionPopover;
