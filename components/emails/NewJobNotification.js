import * as React from "react";
import { Html, Button } from "@react-email/components";

const NewJobNotification = ({ jobTitle, jobDescription, jobLink }) => (
	<Html lang="en">
		<h1>New Job Available: {jobTitle}</h1>
		<p>{jobDescription}</p>
		<Button href={jobLink}>View Job</Button>
	</Html>
);

export default NewJobNotification;
