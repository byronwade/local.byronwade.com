"use client";
import React, { useState } from "react";
import { useCommentsContext } from "@context/posts/CommentsContext";
import Comment from "@components/site/biz/layout/comment/Comment";

const CommentSection = () => {
	const { comments } = useCommentsContext();
	const [replyBox, setReplyBox] = useState(null);
	const [replyText, setReplyText] = useState({});

	const handleReplyClick = (commentId) => {
		setReplyBox((prev) => (prev === commentId ? null : commentId));
	};

	const handleAddReply = (commentId) => {
		// Add your logic for adding replies here
		console.log(`Reply added to comment ${commentId}: ${replyText[commentId]}`);
		setReplyText((prev) => ({ ...prev, [commentId]: "" }));
		setReplyBox(null);
	};

	return (
		<div className="flex w-full p-4 bg-gray-900 rounded-b-md">
			<div className="flex flex-col w-full h-auto space-y-4">
				{comments.map((comment) => (
					<Comment key={comment.id} comment={comment} handleReplyClick={handleReplyClick} replyBox={replyBox} replyText={replyText} setReplyText={setReplyText} handleAddReply={handleAddReply} />
				))}
			</div>
		</div>
	);
};

export default CommentSection;
