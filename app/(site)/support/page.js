import React from "react";

export default function SupportPage() {
	return (
		<main className="relative min-h-screen !min-h-fit">
			<div className="bg-alternative">
				<div className="container relative px-6 py-16 mx-auto space-y-2 text-center sm:py-18 md:py-24 lg:px-16 lg:py-24 xl:px-20">
					<h1 className="font-mono text-base tracking-widest uppercase text-brand">Support</h1>
					<p className="h1 tracking-[-1px]">Hello, how can we help?</p>
					<button type="button" className="w-full max-w-lg mx-auto">
						<div className="flex items-center justify-between px-3 py-3 transition border rounded group bg-background border-control hover:bg-surface-100">
							<div className="flex items-center flex-1 space-x-2">
								<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="sbui-icon text-foreground-light">
									<circle cx={11} cy={11} r={8} />
									<line x1={21} y1={21} x2="16.65" y2="16.65" />
								</svg>
								<p className="text-sm transition text-foreground-lighter group-hover:text-foreground-light">How do I connec</p>
							</div>
							<div className="flex items-center h-full space-x-1">
								<div className="items-center justify-center hidden w-10 h-5 gap-1 border rounded text-foreground-lighter md:flex bg-surface-300 border-foreground-lighter/30">
									<svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="sbui-icon">
										<path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
									</svg>
									<span className="text-[12px]">K</span>
								</div>
							</div>
						</div>
					</button>
				</div>
			</div>
			<div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 text grid gap-5 md:grid-cols-2 xl:grid-cols-3 max-w-7xl !pb-8">
				<div className="relative flex items-center justify-center p-px transition-all shadow-md rounded-xl bg-surface-100 bg-gradient-to-b from-border to-border/50 dark:to-surface-100">
					<div className="relative z-10 flex flex-col w-full h-full p-5 overflow-hidden rounded-xl bg-surface-100 text-foreground-light">
						<div className="flex-1 mb-4 lg:mb-8">
							<h2 className="text-lg font-medium text">Issues</h2>
							<div className="block my-2">
								<p className="text-foreground-light">Found a bug? We&apos;d love to hear about it in our GitHub issues.</p>
							</div>
						</div>
						<div className="flex gap-2">
							<a
								target="_blank"
								data-size="small"
								type="button"
								className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-sm leading-4 px-3 py-2 h-[34px]"
								href="https://github.com/supabase/supabase/issues"
							>
								<span className="truncate">Open GitHub Issue</span>
								<div className="[&_svg]:h-[18px] [&_svg]:w-[18px] text-foreground-muted">
									<div className="relative" style={{ width: 18, height: 18 }}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="none" className="sbui-icon" width="100%" height="100%">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M8 0C3.5816 0 0 3.58719 0 8.01357C0 11.5535 2.292 14.5575 5.4712 15.6167C5.8712 15.6903 6.0168 15.4431 6.0168 15.2303C6.0168 15.0407 6.0104 14.5359 6.0064 13.8679C3.7808 14.3519 3.3112 12.7935 3.3112 12.7935C2.948 11.8671 2.4232 11.6207 2.4232 11.6207C1.6968 11.1247 2.4784 11.1343 2.4784 11.1343C3.2808 11.1903 3.7032 11.9599 3.7032 11.9599C4.4168 13.1839 5.576 12.8303 6.0312 12.6255C6.1048 12.1079 6.3112 11.7551 6.54 11.5551C4.764 11.3527 2.896 10.6647 2.896 7.59438C2.896 6.71998 3.208 6.00398 3.7192 5.44398C3.6368 5.24158 3.3624 4.42639 3.7976 3.32399C3.7976 3.32399 4.4696 3.10799 5.9976 4.14479C6.65022 3.9668 7.32355 3.87614 8 3.87519C8.68 3.87839 9.364 3.96719 10.0032 4.14479C11.5304 3.10799 12.2008 3.32319 12.2008 3.32319C12.6376 4.42639 12.3624 5.24158 12.2808 5.44398C12.7928 6.00398 13.1032 6.71998 13.1032 7.59438C13.1032 10.6727 11.232 11.3503 9.4504 11.5487C9.73762 11.7959 9.99282 12.2847 9.99282 13.0327C9.99282 14.1031 9.98322 14.9679 9.98322 15.2303C9.98322 15.4447 10.1272 15.6943 10.5336 15.6159C12.1266 15.0816 13.5115 14.0602 14.4924 12.696C15.4733 11.3318 16.0007 9.69382 16 8.01357C16 3.58719 12.4176 0 8 0Z"
												fill="currentColor"
											/>
										</svg>
									</div>
								</div>
							</a>
						</div>
						<div className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-20" />
					</div>
				</div>
				<div className="relative flex items-center justify-center p-px transition-all shadow-md rounded-xl bg-surface-100 bg-gradient-to-b from-border to-border/50 dark:to-surface-100">
					<div className="relative z-10 flex flex-col w-full h-full p-5 overflow-hidden rounded-xl bg-surface-100 text-foreground-light">
						<div className="flex-1 mb-4 lg:mb-8">
							<h2 className="text-lg font-medium text">Feature requests</h2>
							<div className="block my-2">
								<p className="text-foreground-light">Want to suggest a new feature? Share it with us and the community.</p>
							</div>
						</div>
						<div className="flex gap-2">
							<a
								target="_blank"
								data-size="small"
								type="button"
								className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-sm leading-4 px-3 py-2 h-[34px]"
								href="https://github.com/orgs/supabase/discussions/categories/feature-requests"
							>
								<span className="truncate">Request feature</span>
								<div className="[&_svg]:h-[18px] [&_svg]:w-[18px] text-foreground-muted">
									<div className="relative" style={{ width: 18, height: 18 }}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="none" className="sbui-icon" width="100%" height="100%">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M8 0C3.5816 0 0 3.58719 0 8.01357C0 11.5535 2.292 14.5575 5.4712 15.6167C5.8712 15.6903 6.0168 15.4431 6.0168 15.2303C6.0168 15.0407 6.0104 14.5359 6.0064 13.8679C3.7808 14.3519 3.3112 12.7935 3.3112 12.7935C2.948 11.8671 2.4232 11.6207 2.4232 11.6207C1.6968 11.1247 2.4784 11.1343 2.4784 11.1343C3.2808 11.1903 3.7032 11.9599 3.7032 11.9599C4.4168 13.1839 5.576 12.8303 6.0312 12.6255C6.1048 12.1079 6.3112 11.7551 6.54 11.5551C4.764 11.3527 2.896 10.6647 2.896 7.59438C2.896 6.71998 3.208 6.00398 3.7192 5.44398C3.6368 5.24158 3.3624 4.42639 3.7976 3.32399C3.7976 3.32399 4.4696 3.10799 5.9976 4.14479C6.65022 3.9668 7.32355 3.87614 8 3.87519C8.68 3.87839 9.364 3.96719 10.0032 4.14479C11.5304 3.10799 12.2008 3.32319 12.2008 3.32319C12.6376 4.42639 12.3624 5.24158 12.2808 5.44398C12.7928 6.00398 13.1032 6.71998 13.1032 7.59438C13.1032 10.6727 11.232 11.3503 9.4504 11.5487C9.73762 11.7959 9.99282 12.2847 9.99282 13.0327C9.99282 14.1031 9.98322 14.9679 9.98322 15.2303C9.98322 15.4447 10.1272 15.6943 10.5336 15.6159C12.1266 15.0816 13.5115 14.0602 14.4924 12.696C15.4733 11.3318 16.0007 9.69382 16 8.01357C16 3.58719 12.4176 0 8 0Z"
												fill="currentColor"
											/>
										</svg>
									</div>
								</div>
							</a>
						</div>
						<div className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-20" />
					</div>
				</div>
				<div className="relative flex items-center justify-center p-px transition-all shadow-md rounded-xl bg-surface-100 bg-gradient-to-b from-border to-border/50 dark:to-surface-100 col-span-full xl:col-span-1">
					<div className="relative z-10 flex flex-col w-full h-full p-5 overflow-hidden rounded-xl bg-surface-100 text-foreground-light">
						<div className="flex-1 mb-4 lg:mb-8">
							<h2 className="text-lg font-medium text">Ask the Community</h2>
							<div className="block my-2">
								<p className="text-foreground-light">Join our GitHub discussions or our Discord server to browse for help and best practices.</p>
							</div>
						</div>
						<div className="flex gap-2">
							<a
								target="_blank"
								data-size="small"
								type="button"
								className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-sm leading-4 px-3 py-2 h-[34px]"
								href="https://github.com/supabase/supabase/discussions"
							>
								<span className="truncate">Ask a question</span>
								<div className="[&_svg]:h-[18px] [&_svg]:w-[18px] text-foreground-muted">
									<div className="relative" style={{ width: 18, height: 18 }}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="none" className="sbui-icon" width="100%" height="100%">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M0 3.07692C0 1.37759 1.37759 0 3.07693 0H12.9231C14.6224 0 16 1.37758 16 3.07692V9.69032C16 11.3897 14.6224 12.7672 12.9231 12.7672H7.65829L4.73596 15.8108C4.562 15.992 4.29538 16.0493 4.06236 15.9555C3.82934 15.8617 3.67669 15.6358 3.67669 15.3846V12.7672H3.07693C1.37759 12.7672 0 11.3897 0 9.69032V3.07692ZM3.07693 1.23077C2.05732 1.23077 1.23077 2.05732 1.23077 3.07692V9.69032C1.23077 10.7099 2.05732 11.5365 3.07693 11.5365H4.29207C4.63194 11.5365 4.90745 11.812 4.90745 12.1519V13.8552L6.95214 11.7256C7.06819 11.6048 7.22849 11.5365 7.39604 11.5365H12.9231C13.9427 11.5365 14.7692 10.7099 14.7692 9.69032V3.07692C14.7692 2.05732 13.9427 1.23077 12.9231 1.23077H3.07693ZM5.53846 5.86479C5.87833 5.86479 6.15385 6.14031 6.15385 6.48017C6.15385 6.82004 5.87833 7.09556 5.53846 7.09556C5.1986 7.09556 4.92308 6.82004 4.92308 6.48017C4.92308 6.14031 5.1986 5.86479 5.53846 5.86479ZM8 5.86479C8.33987 5.86479 8.61539 6.14031 8.61539 6.48017C8.61539 6.82004 8.33987 7.09556 8 7.09556C7.66014 7.09556 7.38462 6.82004 7.38462 6.48017C7.38462 6.14031 7.66014 5.86479 8 5.86479ZM10.4615 5.86479C10.8014 5.86479 11.0769 6.14031 11.0769 6.48017C11.0769 6.82004 10.8014 7.09556 10.4615 7.09556C10.1217 7.09556 9.84612 6.82004 9.84612 6.48017C9.84612 6.14031 10.1217 5.86479 10.4615 5.86479Z"
												fill="currentColor"
											/>
										</svg>
									</div>
								</div>
							</a>
							<a
								target="_blank"
								data-size="small"
								type="button"
								className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-foreground text-background hover:text-border-stronger focus-visible:text-border-control border-foreground-light hover:border-foreground-lighter focus-visible:outline-border-strong data-[state=open]:border-foreground-lighter data-[state=open]:outline-border-strong text-sm leading-4 px-3 py-2 h-[34px]"
								href="https://discord.supabase.com/"
							>
								<span className="truncate">Join Discord</span>
								<div className="[&_svg]:h-[18px] [&_svg]:w-[18px] text-border-muted">
									<div className="relative" style={{ width: 18, height: 18 }}>
										<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="hsl(var(--background-default))" stroke="none" className="sbui-icon" width="100%" height="100%">
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M13.5447 3.01094C12.5249 2.54302 11.4313 2.19828 10.2879 2.00083C10.2671 1.99702 10.2463 2.00654 10.2356 2.02559C10.0949 2.27573 9.93921 2.60206 9.83011 2.85856C8.60028 2.67444 7.3768 2.67444 6.17222 2.85856C6.06311 2.59636 5.90166 2.27573 5.76038 2.02559C5.74966 2.00717 5.72887 1.99765 5.70803 2.00083C4.56527 2.19764 3.47171 2.54239 2.45129 3.01094C2.44246 3.01475 2.43488 3.0211 2.42986 3.02935C0.355594 6.12826 -0.212633 9.151 0.06612 12.1362C0.067381 12.1508 0.0755799 12.1648 0.0869319 12.1737C1.45547 13.1787 2.78114 13.7889 4.08219 14.1933C4.10301 14.1996 4.12507 14.192 4.13832 14.1749C4.44608 13.7546 4.72043 13.3114 4.95565 12.8454C4.96953 12.8181 4.95628 12.7857 4.92791 12.7749C4.49275 12.6099 4.0784 12.4086 3.67982 12.18C3.64829 12.1616 3.64577 12.1165 3.67477 12.095C3.75865 12.0321 3.84255 11.9667 3.92264 11.9007C3.93713 11.8886 3.95732 11.8861 3.97435 11.8937C6.59287 13.0892 9.42771 13.0892 12.0153 11.8937C12.0323 11.8854 12.0525 11.888 12.0677 11.9C12.1478 11.9661 12.2316 12.0321 12.3161 12.095C12.3451 12.1165 12.3433 12.1616 12.3117 12.18C11.9131 12.413 11.4988 12.6099 11.063 12.7743C11.0346 12.7851 11.022 12.8181 11.0359 12.8454C11.2762 13.3108 11.5505 13.7539 11.8526 14.1742C11.8652 14.192 11.8879 14.1996 11.9087 14.1933C13.2161 13.7889 14.5417 13.1787 15.9103 12.1737C15.9223 12.1648 15.9298 12.1515 15.9311 12.1369C16.2647 8.6856 15.3723 5.68765 13.5655 3.02998C13.5611 3.0211 13.5535 3.01475 13.5447 3.01094ZM5.34668 10.3185C4.55833 10.3185 3.90876 9.59478 3.90876 8.70593C3.90876 7.81707 4.54574 7.09331 5.34668 7.09331C6.15393 7.09331 6.79722 7.82342 6.7846 8.70593C6.7846 9.59478 6.14762 10.3185 5.34668 10.3185ZM10.6632 10.3185C9.87481 10.3185 9.22527 9.59478 9.22527 8.70593C9.22527 7.81707 9.86221 7.09331 10.6632 7.09331C11.4704 7.09331 12.1137 7.82342 12.1011 8.70593C12.1011 9.59478 11.4704 10.3185 10.6632 10.3185Z"
												fill="currentColor"
											/>
										</svg>
									</div>
								</div>
							</a>
						</div>
						<div className="absolute inset-0 z-10 w-full h-full pointer-events-none opacity-20" />
					</div>
				</div>
			</div>
			<div className="sm:py-18 container relative mx-auto px-6 py-16 md:py-24 lg:px-16 lg:py-24 xl:px-20 !pt-0 max-w-7xl">
				<div className="p-6 mx-auto border bg-alternative rounded-xl lg:p-10">
					<div className="grid justify-between grid-cols-1 gap-2 lg:grid-cols-2 xl:gap-16">
						<div className="flex flex-col gap-2">
							<h2 className="text-xl tracking-tight lg:text-2xl">Can&apos;t find what you&apos;re looking for?</h2>
						</div>
						<div className="flex flex-col gap-4">
							<div className="flex flex-col">
								<p className="text-foreground-light">The Supabase Support Team is ready to help.</p>
								<p className="text-sm text-foreground-lighter">Response time for support tickets will vary depending on plan type and severity of the issue.</p>
							</div>
							<div className="flex gap-2">
								<a
									target="_blank"
									className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground bg-alternative dark:bg-muted hover:bg-selection border-strong hover:border-stronger focus-visible:outline-brand-600 data-[state=open]:bg-selection data-[state=open]:outline-brand-600 data-[state=open]:border-button-hover text-xs px-2.5 py-1 h-[26px]"
									data-size="tiny"
									type="button"
									href="https://forms.supabase.com/enterprise"
								>
									<span className="truncate">Contact Enterprise Sales</span>
								</a>
								<a
									target="_blank"
									className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-foreground hover:bg-surface-300 shadow-none focus-visible:outline-border-strong data-[state=open]:bg-surface-300 data-[state=open]:outline-border-strong border-transparent text-xs px-2.5 py-1 h-[26px] !text-foreground-light hover:!text-foreground"
									data-size="tiny"
									type="button"
									href="https://supabase.com/dashboard/support/new"
								>
									<span className="truncate">Open Ticket</span>
									<div className="[&_svg]:h-[14px] [&_svg]:w-[14px] text-foreground-muted">
										<svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="sbui-icon">
											<line x1={7} y1={17} x2={17} y2={7} />
											<polyline points="7 7 17 7 17 17" />
										</svg>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
