// components/site/biz/layout/post/PostContent.js
"use client";
import React from "react";
import { usePostContext } from "@context/posts/PostContext";
import { useReactionsContext } from "@context/posts/ReactionsContext";
import Reactions from "@components/site/biz/layout/comment/Reactions";
import ReactionTrigger from "@components/site/biz/layout/comment/ReactionTrigger";
import CommentSection from "@components/site/biz/layout/comment/CommentSection";
import { ThumbsUp, MessageCircle, Share2 } from "react-feather"; // Import icons
import ReviewPost from "../comment/postTypes/ReviewPost";
import ImagePost from "../comment/postTypes/ImagePost";
import CommentPost from "../comment/postTypes/CommentPost";
import VideoPost from "../comment/postTypes/VideoPost";
import DateDisplay from "@components/site/biz/layout/shared/DateDisplay";
import Image from "next/image";
import { Card } from "@components/ui/card";

const PostContent = () => {
	const { post, showComments, setShowComments } = usePostContext();
	const { reactions } = useReactionsContext();
	const { user = {}, date = "", content = "", type = "comment", comments = [], media, rating, allowComments, allowLikes, allowSharing } = post;
	const { avatar = "", name = "" } = user;

	const renderContent = () => {
		const commonProps = {
			post: { ...post, user, date, content, comments, media, rating },
			showComments,
			setShowComments,
		};

		switch (type) {
			case "comment":
				return <CommentPost {...commonProps} />;
			case "image":
				return <ImagePost {...commonProps} />;
			case "video":
				return <VideoPost {...commonProps} />;
			case "review":
				return <ReviewPost {...commonProps} />;
			default:
				return <CommentPost {...commonProps} />;
		}
	};

	return (
		<div className="w-full">
			<Card className={`${showComments ? "rounded-b-[0px]" : "rounded-b-lg"}`}>
				<div className="flex p-4">
					<Image width={100} height={100} className="w-12 h-12 rounded-full" src={avatar} alt={name} />
					<div className="ml-2 mt-0.5">
						<span className="block text-base font-medium leading-snug text-black dark:text-gray-100">{name}</span>
						<DateDisplay date={date} /> {/* Use DateDisplay component */}
					</div>
				</div>
				{renderContent()}
				<div className="flex items-center justify-between px-4 mt-5">
					{/* Container for reactions and comments */}
					<div className="flex items-center">
						<Reactions reactions={reactions[post.id] || {}} />
					</div>
					{/* Comment count aligned to the right */}
					{allowComments && (
						<div className="text-gray-500 cursor-pointer dark:text-gray-400 hover:underline" onClick={() => setShowComments(!showComments)}>
							{comments.length} comments
						</div>
					)}
				</div>
				<div className="flex justify-around p-4">
					{allowLikes && (
						<ReactionTrigger postId={post.id}>
							<span className="flex items-center text-gray-500 cursor-pointer dark:text-gray-400 hover:text-blue-500">
								<ThumbsUp className="w-5 h-5 mr-1" /> Like
							</span>
						</ReactionTrigger>
					)}
					{allowComments && (
						<button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500" onClick={() => setShowComments(!showComments)}>
							<MessageCircle className="w-5 h-5 mr-1" /> Comment
						</button>
					)}
					{allowSharing && (
						<button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500">
							<Share2 className="w-5 h-5 mr-1" /> Share
						</button>
					)}
				</div>
			</Card>
			{showComments && <CommentSection />}
		</div>
	);
};

export default PostContent;
