import React from "react";
import Image from "next/image";

export default function ThorbisBubble({ message }) {
	return (
		<div className="w-full px-3 py-4 m-auto md:px-4 lg:px-1 xl:px-5">
			<div className="mx-auto flex flex-1 gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
				<div className="flex flex-col items-end flex-shrink-0">
					<div className="flex items-center justify-center w-8 h-8 p-1 overflow-hidden rounded-full">
						<Image src="/chatgpt.svg" width={41} height={41} alt="robot" className="w-[41px] h-[41px] filter invert" />
					</div>
				</div>
				<div className="relative flex flex-col w-full min-w-0 gap-1 md:gap-3">
					<div className="flex flex-col flex-grow max-w-full">
						<div className="flex flex-col w-full gap-2 pt-[3px] min-h-[20px] whitespace-pre-wrap break-words overflow-x-auto items-start">
							<div className="w-full text-sm prose text-left break-words dark:prose-invert">
								<p>{message}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
