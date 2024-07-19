import React from "react";

const CommentPost = ({ post, showComments, setShowComments }) => {
	const { content, comments } = post;

	return (
		<div className="px-4">
			<p>{content}</p>
		</div>
	);
};

export default CommentPost;
