"use client";

import React from "react";

import { FaYahoo } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { SiAol } from "react-icons/si";

const UserSuccess = () => {
	return (
		<>
			<h2 className="mb-1 text-2xl font-bold leading-9 text-left text-gray-900 text-green-600 dark:text-green-500">Successful signup</h2>
			<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-300">An email has been sent to your email and will need to be confirmed before the account is avaliable to use.</p>
			<div className="flex flex-col mt-6">
				<div className="space-y-4">
					<p className="text-sm leading-6 text-left text-gray-600 dark:text-gray-200">Click on one of the icons below to open your email provider:</p>
					<div className="flex flex-row space-x-4">
						<a href="https://mail.google.com/" target="_blank" rel="noopener noreferrer" className="text-[#EA4335] p-4 bg-white border dark:hover:bg-dark-950 hover:bg-gray-100 border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
							<BiLogoGmail size={36} />
						</a>
						<a href="https://mail.yahoo.com/" target="_blank" rel="noopener noreferrer" className="text-[#720E9E] p-4 bg-white border dark:hover:bg-dark-950 hover:bg-gray-100 border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
							<FaYahoo size={36} />
						</a>
						<a href="https://mail.aol.com/" target="_blank" rel="noopener noreferrer" className="text-[#00A4E4] p-4 bg-white border dark:hover:bg-dark-950 hover:bg-gray-100 border-gray-300 dark:border-neutral-800 dark:bg-neutral-900 focus-within:border-brand focus:border-brand dark:focus:border-brand dark:focus-within:border-brand">
							<SiAol size={36} />
						</a>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserSuccess;
