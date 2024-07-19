import React from "react";
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

const Reactions = ({ reactions = {} }) => {
	const totalReactions = Object.values(reactions).reduce((acc, count) => acc + count, 0);

	if (totalReactions === 0) return null;

	return (
		<div className="flex items-center space-x-1">
			<span>{totalReactions}</span>
			{Object.keys(reactions).map((reaction) => {
				const Icon = reactionsIcons[reaction];
				return (
					<div key={reaction} className={`flex items-center justify-center w-5 h-5 rounded-full ${reactionColors[reaction]}`}>
						<Icon className="w-3 h-3" />
					</div>
				);
			})}
		</div>
	);
};

export default Reactions;
