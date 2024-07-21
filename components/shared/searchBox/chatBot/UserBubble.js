import React from "react";

export default function UserBubble({ message }) {
	return (
		<div className="w-full px-3 py-4 m-auto md:px-4 lg:px-1 xl:px-5">
			<div className="mx-auto flex flex-1 gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
				<div className="relative flex flex-col w-full min-w-0 gap-1 md:gap-3">
					<div className="flex flex-col flex-grow max-w-full">
						<div className="min-h-[20px] flex w-full flex-col items-end gap-2 whitespace-pre-wrap break-words overflow-x-auto mt-5">
							<div className="flex flex-col items-end w-full gap-1 rtl:items-start">
								<div className="relative max-w-[70%] rounded-3xl bg-[#2f2f2f] px-5 py-2.5 dark:bg-token-main-surface-secondary text-left">
									<div>{message}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
