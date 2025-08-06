import * as React from "react";
import { Html } from "@react-email/components";

const JobCompletion = ({ jobTitle, feedbackLink }) => (
	<Html lang="en">
		<h1>Job Completed: {jobTitle}</h1>
		<p>Your job has been completed successfully. Please provide your feedback by clicking the link below:</p>
		<a href={feedbackLink}>Provide Feedback</a>
	</Html>
);

export default JobCompletion;
