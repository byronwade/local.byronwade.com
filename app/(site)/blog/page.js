export const metadata = {
	title: "Business Blog - Tips, Insights & Industry News | Thorbis",
	description: "Stay informed with the latest business trends, tips, and insights. Our blog covers local business strategies, marketing, technology, and industry updates.",
	keywords: ["business blog", "local business tips", "industry insights", "business strategies", "marketing tips", "business news", "entrepreneurship"],
	openGraph: {
		title: "Business Blog - Tips, Insights & Industry News | Thorbis",
		description: "Stay informed with the latest business trends, tips, and insights. Our blog covers local business strategies, marketing, technology, and industry updates.",
		url: "https://local.byronwade.com/blog",
		siteName: "Thorbis",
		images: [
			{
				url: "https://local.byronwade.com/og-blog.jpg",
				width: 1200,
				height: 630,
				alt: "Thorbis Business Blog",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Business Blog - Thorbis",
		description: "Stay informed with the latest business trends and insights.",
		images: ["https://local.byronwade.com/og-blog.jpg"],
	},
	alternates: {
		canonical: "https://local.byronwade.com/blog",
	},
};

import React from "react";

export default function Blog() {
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "Blog",
		name: "Thorbis Business Blog",
		description: "Business insights, tips, and industry news",
		url: "https://local.byronwade.com/blog",
		publisher: {
			"@type": "Organization",
			name: "Thorbis",
		},
	};

	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<main className="bg-white dark:bg-black">
				<div className="container flex justify-between px-4 mx-auto">
					<div className="hidden mb-6 xl:block lg:w-80">
						<div className="sticky top-36">
							<aside>
								<div className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
									<h1 className="mb-2 font-bold text-gray-900 uppercase dark:text-white">Flowbite Blog</h1>
									<p className="text-sm text-gray-500 dark:text-gray-400">Blog posts, articles, and tutorials about web development and design.</p>
								</div>
								<div className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
									<h4 className="mb-4 font-bold text-gray-900 uppercase dark:text-white">Resources</h4>
									<a className="inline-flex items-center justify-center w-full p-5 mb-4 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white" href="/docs/getting-started/introduction/">
										<svg aria-hidden="true" className="w-5 h-5 mr-3" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path
												d="M24.5199 12.9424C24.4458 13.4528 24.1092 14.1463 23.723 14.7492C23.2358 15.51 22.4627 16.0428 21.5779 16.2278L17.6802 17.0429C17.0537 17.1739 16.4857 17.5017 16.0592 17.9785L13.5035 20.8352C13.0232 21.3721 12.6875 21.244 12.6875 20.5239C12.6817 20.5506 11.4191 23.8067 14.7651 25.7366C16.0507 26.4782 17.9013 26.2117 19.1869 25.4702L25.9988 21.5411C28.5463 20.0717 30.345 17.5859 30.9428 14.7084C30.9665 14.5946 30.9848 14.4803 31.0045 14.3662L24.5199 12.9424Z"
												fill="url(#paint0_linear_4151_62980)"
											/>
											<path d="M22.7528 9.01774C24.0384 9.75928 24.5637 10.8633 24.5637 12.3464C24.5637 12.5477 24.5479 12.7466 24.5194 12.9425L27.2641 14.1215L31.004 14.3663C31.4829 11.5948 30.5444 8.74202 28.862 6.47445C27.5959 4.768 25.9667 3.28713 24.0081 2.15738C22.417 1.23966 20.7636 0.635005 19.1025 0.303223L17.2361 2.72023L16.6465 5.49559L22.7528 9.01774Z" fill="url(#paint1_linear_4151_62980)" />
											<path d="M0.783353 11.0516C0.782654 11.0537 0.784588 11.0544 0.785316 11.0522C0.929339 10.6202 1.10993 10.1383 1.33539 9.62344C2.5131 6.93406 4.78262 5.14038 7.57467 4.22583C10.3667 3.31131 13.4153 3.63188 15.9599 5.09963L16.6463 5.49553L19.1023 0.303168C11.2907 -1.25701 3.30703 3.33229 0.793284 11.0215C0.792083 11.0251 0.787713 11.038 0.783353 11.0516Z" fill="url(#paint2_linear_4151_62980)" />
											<path d="M18.9201 25.4702C17.6345 26.2117 16.0506 26.2117 14.765 25.4702C14.5904 25.3695 14.4259 25.2563 14.2703 25.1338L12.0093 26.6883L10.0605 29.8374C12.2236 31.6374 15.0324 32.2161 17.8392 31.8943C19.9515 31.6521 22.0498 30.9829 24.0084 29.8532C25.5995 28.9355 26.9503 27.8073 28.0685 26.5359L26.9065 23.7126L25.0265 21.948L18.9201 25.4702Z" fill="url(#paint3_linear_4151_62980)" />
											<path d="M14.2694 25.1339C13.2789 24.3537 12.6864 23.157 12.6864 21.8752V21.7474V11.0722C12.6864 10.4685 12.8643 10.3659 13.3876 10.6677C12.5816 10.2028 10.7195 8.60676 8.42044 9.9329C7.13484 10.6744 6.07617 12.3113 6.07617 13.7944V21.6526C6.07617 24.5915 7.59833 27.657 9.79375 29.613C9.88059 29.6904 9.97049 29.7633 10.0596 29.8375L14.2694 25.1339Z" fill="url(#paint4_linear_4151_62980)" />
											<path d="M27.9097 5.31206C27.9081 5.31036 27.9066 5.31173 27.9081 5.31343C28.2106 5.65404 28.538 6.05126 28.8716 6.50375C30.614 8.8674 31.2651 11.8611 30.6618 14.734C30.0586 17.607 28.2564 20.0843 25.7118 21.5521L25.0254 21.948L28.0674 26.5359C33.3256 20.5574 33.3392 11.3552 27.9308 5.3357C27.9282 5.33282 27.9193 5.32262 27.9097 5.31206Z" fill="url(#paint5_linear_4151_62980)" />
											<path d="M6.34355 13.7944C6.34354 12.3113 7.13551 10.9408 8.42113 10.1993C8.59564 10.0986 8.77601 10.0129 8.96002 9.93951L8.74304 7.20603L7.21861 4.07861C4.57671 5.05005 2.4397 7.05766 1.31528 9.64708C0.469097 11.5957 9.792e-06 13.7458 0 16.0052C0 17.8407 0.302549 19.5735 0.845532 21.1767L3.87391 21.583L6.34355 20.8387V13.7944Z" fill="url(#paint6_linear_4151_62980)" />
											<path
												d="M8.96016 9.93951C10.1317 9.47264 11.4653 9.5584 12.5764 10.1993L12.6872 10.2632L21.5826 15.3941C22.2066 15.754 22.1499 16.1082 21.4446 16.2557L21.9578 16.1484C22.633 16.0072 23.2499 15.6621 23.7217 15.1592C24.5328 14.2946 24.8306 13.2515 24.8306 12.3463C24.8306 10.8632 24.0386 9.49274 22.753 8.7512L15.9411 4.82209C13.3936 3.35267 10.3395 3.03934 7.54622 3.96083C7.43572 3.99727 7.32756 4.0386 7.21875 4.07861L8.96016 9.93951Z"
												fill="url(#paint7_linear_4151_62980)"
											/>
											<path d="M19.3224 31.6521C19.3246 31.6516 19.3242 31.6496 19.3219 31.6501C18.8755 31.7414 18.3674 31.8262 17.8084 31.8885C14.8882 32.2142 11.9677 31.2807 9.77888 29.3223C7.59011 27.3638 6.34372 24.5659 6.34372 21.6304L6.34371 20.8386L0.845703 21.1766C3.39905 28.7153 11.3691 33.3282 19.2913 31.6585C19.2951 31.6577 19.3084 31.6551 19.3224 31.6521Z" fill="url(#paint8_linear_4151_62980)" />
											<defs>
												<linearGradient id="paint0_linear_4151_62980" x1="20.0604" y1="23.7696" x2="23.2079" y2="12.8065" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1724C9" />
													<stop offset={1} stopColor="#1C64F2" />
												</linearGradient>
												<linearGradient id="paint1_linear_4151_62980" x1="27.3093" y1="10.4001" x2="19.0297" y2="2.14962" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1C64F2" />
													<stop offset={1} stopColor="#0092FF" />
												</linearGradient>
												<linearGradient id="paint2_linear_4151_62980" x1="16.1642" y1="5.0209" x2="3.67407" y2="5.81015" gradientUnits="userSpaceOnUse">
													<stop stopColor="#0092FF" />
													<stop offset={1} stopColor="#45B2FF" />
												</linearGradient>
												<linearGradient id="paint3_linear_4151_62980" x1="15.32" y1="28.6624" x2="26.5369" y2="25.6356" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1C64F2" />
													<stop offset={1} stopColor="#0092FF" />
												</linearGradient>
												<linearGradient id="paint4_linear_4151_62980" x1="7.26808" y1="15.6825" x2="15.2317" y2="23.9345" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1724C9" />
													<stop offset={1} stopColor="#1C64F2" />
												</linearGradient>
												<linearGradient id="paint5_linear_4151_62980" x1="25.4497" y1="21.6353" x2="31.0061" y2="10.4342" gradientUnits="userSpaceOnUse">
													<stop stopColor="#0092FF" />
													<stop offset={1} stopColor="#45B2FF" />
												</linearGradient>
												<linearGradient id="paint6_linear_4151_62980" x1="5.36387" y1="9.13067" x2="2.39054" y2="20.3063" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1C64F2" />
													<stop offset={1} stopColor="#0092FF" />
												</linearGradient>
												<linearGradient id="paint7_linear_4151_62980" x1="20.5432" y1="8.59912" x2="9.6778" y2="11.3044" gradientUnits="userSpaceOnUse">
													<stop stopColor="#1724C9" />
													<stop offset={1} stopColor="#1C64F2" />
												</linearGradient>
												<linearGradient id="paint8_linear_4151_62980" x1="6.40691" y1="21.3563" x2="13.3327" y2="31.7743" gradientUnits="userSpaceOnUse">
													<stop stopColor="#0092FF" />
													<stop offset={1} stopColor="#45B2FF" />
												</linearGradient>
											</defs>
										</svg>
										<span className="w-full">Flowbite Library</span>
										<svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
									<a className="inline-flex items-center justify-center w-full p-5 mb-4 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white" href="/figma/">
										<svg aria-hidden="true" className="w-5 h-5 mr-3" viewBox="0 0 22 31" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g clipPath="url(#clip0_4151_63004)">
												<path d="M5.50085 30.1242C8.53625 30.1242 10.9998 27.8749 10.9998 25.1035V20.0828H5.50085C2.46546 20.0828 0.00195312 22.332 0.00195312 25.1035C0.00195312 27.8749 2.46546 30.1242 5.50085 30.1242Z" fill="#0ACF83" />
												<path d="M0.00195312 15.062C0.00195312 12.2905 2.46546 10.0413 5.50085 10.0413H10.9998V20.0827H5.50085C2.46546 20.0827 0.00195312 17.8334 0.00195312 15.062Z" fill="#A259FF" />
												<path d="M0.00195312 5.02048C0.00195312 2.24904 2.46546 -0.000244141 5.50085 -0.000244141H10.9998V10.0412H5.50085C2.46546 10.0412 0.00195312 7.79193 0.00195312 5.02048Z" fill="#F24E1E" />
												<path d="M11 -0.000244141H16.4989C19.5343 -0.000244141 21.9978 2.24904 21.9978 5.02048C21.9978 7.79193 19.5343 10.0412 16.4989 10.0412H11V-0.000244141Z" fill="#FF7262" />
												<path d="M21.9978 15.062C21.9978 17.8334 19.5343 20.0827 16.4989 20.0827C13.4635 20.0827 11 17.8334 11 15.062C11 12.2905 13.4635 10.0413 16.4989 10.0413C19.5343 10.0413 21.9978 12.2905 21.9978 15.062Z" fill="#1ABCFE" />
											</g>
											<defs>
												<clipPath id="clip0_4151_63004">
													<rect width={22} height="30.1244" fill="white" transform="translate(0 -0.000244141)" />
												</clipPath>
											</defs>
										</svg>
										<span className="w-full">Figma design system</span>
										<svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
									<a href="https://themesberg.com/templates/tailwind-css" className="inline-flex items-center justify-center w-full p-5 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-white">
										<svg aria-hidden="true" className="w-5 h-5 mr-3" viewBox="0 0 26 31" fill="none" xmlns="http://www.w3.org/2000/svg">
											<g clipPath="url(#clip0_4151_62985)">
												<path
													d="M25.7689 0.901322L15.1763 3.49437C15.0758 3.51776 14.9717 3.52086 14.87 3.50352C14.7683 3.48617 14.6711 3.44871 14.5841 3.39335L9.57667 0.121964C9.48513 0.0624589 9.38179 0.0234753 9.27373 0.00769593C9.16568 -0.00808342 9.05549 -0.000283916 8.95074 0.0305577L0.284074 2.58031C0.204603 2.59938 0.133665 2.64415 0.0822909 2.70766C0.030917 2.77117 0.001987 2.84986 0 2.9315L0 8.11761L8.95074 5.48607C9.05549 5.45522 9.16568 5.44743 9.27373 5.4632C9.38179 5.47898 9.48513 5.51797 9.57667 5.57747L14.5841 8.84404C14.6701 8.90151 14.7674 8.94022 14.8694 8.95762C14.9715 8.97503 15.076 8.97075 15.1763 8.94507L26 6.2991V1.07451C25.9987 1.02559 25.9784 0.979095 25.9433 0.944943C25.9082 0.91079 25.8612 0.891685 25.8122 0.891701L25.7689 0.901322Z"
													fill="#FF7F66"
												/>
												<path
													d="M19.377 13.3953L15.1737 14.4056C15.0733 14.4301 14.969 14.4338 14.8671 14.4164C14.7652 14.399 14.668 14.361 14.5815 14.3046L9.57406 11.0332C9.5541 11.0191 9.53145 11.0092 9.50752 11.0042C9.48359 10.9993 9.45888 10.9992 9.43495 11.0042C9.41101 11.0092 9.38835 11.019 9.36838 11.0331C9.34841 11.0472 9.33156 11.0652 9.31887 11.0861C9.29667 11.1132 9.28474 11.1473 9.28517 11.1823V16.1038C9.28501 16.164 9.2999 16.2232 9.32849 16.2762C9.35708 16.3291 9.39846 16.374 9.44887 16.4069L14.5815 19.7745C14.6684 19.8301 14.7658 19.8673 14.8676 19.8839C14.9695 19.9004 15.0736 19.8959 15.1737 19.8707L19.6178 18.8075C20.336 18.6343 20.9753 18.2254 21.4335 17.6463C21.8918 17.0672 22.1425 16.3514 22.1455 15.6131V15.5121C22.1367 14.9234 21.8944 14.3624 21.472 13.952C21.0495 13.5416 20.4814 13.3154 19.8922 13.3232C19.7183 13.3283 19.5456 13.3525 19.377 13.3953Z"
													fill="#FF7F66"
												/>
												<path
													d="M19.377 24.3062L15.1737 25.3165C15.0732 25.3399 14.9691 25.343 14.8674 25.3256C14.7657 25.3083 14.6685 25.2708 14.5815 25.2154L9.57405 21.9441C9.55416 21.9304 9.53176 21.9208 9.50814 21.9158C9.48452 21.9108 9.46015 21.9106 9.43643 21.915C9.41271 21.9195 9.39011 21.9286 9.36993 21.9419C9.34975 21.9551 9.3324 21.9722 9.31886 21.9922C9.29698 22.0213 9.28516 22.0568 9.28516 22.0932V27.0147C9.285 27.0748 9.29989 27.1341 9.32848 27.187C9.35707 27.24 9.39845 27.2849 9.44886 27.3178L14.5815 30.6854C14.6675 30.7429 14.7647 30.7816 14.8668 30.799C14.9688 30.8164 15.0734 30.8121 15.1737 30.7864L19.6178 29.7184C20.3368 29.5467 20.9771 29.1383 21.4356 28.5588C21.8941 27.9794 22.1442 27.2627 22.1455 26.524V26.423C22.1367 25.8343 21.8944 25.2732 21.4719 24.8628C21.0495 24.4525 20.4813 24.2263 19.8922 24.234C19.7181 24.2368 19.5451 24.261 19.377 24.3062Z"
													fill="#FF7F66"
												/>
												<path
													opacity="0.32"
													d="M14.8613 19.8659V14.4344C14.9661 14.4561 15.0743 14.4561 15.1791 14.4344L16.9895 13.9533L18.0487 19.149L15.1598 19.8514C15.0625 19.8774 14.9607 19.8823 14.8613 19.8659ZM19.108 24.3544L15.1791 25.3166C15.0743 25.3382 14.9661 25.3382 14.8613 25.3166V30.7913C14.9661 30.813 15.0743 30.813 15.1791 30.7913L20.1673 29.5694L19.108 24.3544ZM14.8613 8.95966C14.9661 8.98131 15.0743 8.98131 15.1791 8.95966L15.935 8.77685L14.8613 3.50415V8.95966Z"
													fill="#111928"
												/>
												<g opacity="0.16">
													<path opacity="0.16" d="M9.28516 5.4665C9.38726 5.48597 9.48508 5.52344 9.57404 5.57715L14.5815 8.84853C14.6641 8.90343 14.7578 8.93956 14.8559 8.95437V3.49886C14.7578 3.48404 14.6641 3.44792 14.5815 3.39302L9.57404 0.121636C9.48508 0.067925 9.38726 0.0304579 9.28516 0.0109863V5.4665Z" fill="#111928" />
													<path opacity="0.16" d="M14.8559 25.3269C14.7584 25.3073 14.6653 25.2698 14.5815 25.2163L9.57405 21.9449C9.53253 21.9175 9.48184 21.9077 9.43309 21.9176C9.38434 21.9275 9.34153 21.9564 9.31405 21.9978C9.29511 22.0263 9.28506 22.0598 9.28516 22.094V27.0155C9.285 27.0757 9.29989 27.1349 9.32848 27.1878C9.35707 27.2408 9.39845 27.2857 9.44886 27.3186L14.5815 30.6862C14.6659 30.7375 14.7589 30.7733 14.8559 30.792V25.3269Z" fill="#111928" />
													<path opacity="0.16" d="M9.57405 11.0315C9.53253 11.0042 9.48184 10.9943 9.43309 11.0043C9.38434 11.0142 9.34153 11.043 9.31405 11.0845C9.29511 11.113 9.28506 11.1465 9.28516 11.1807V16.1022C9.285 16.1623 9.29989 16.2216 9.32848 16.2745C9.35707 16.3274 9.39845 16.3724 9.44886 16.4053L14.5815 19.7729C14.6652 19.8257 14.7584 19.8616 14.8559 19.8787V14.4328C14.7575 14.4162 14.6638 14.3785 14.5815 14.3222L9.57405 11.0315Z" fill="#111928" />
												</g>
											</g>
											<defs>
												<clipPath id="clip0_4151_62985">
													<rect width={26} height="30.8097" fill="white" transform="translate(0 -0.000244141)" />
												</clipPath>
											</defs>
										</svg>
										<span className="w-full">Tailwind CSS Themes</span>
										<svg className="w-6 h-6 ml-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
								<div className="p-6 mb-6 text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
									<h4 className="mb-4 font-bold text-gray-900 uppercase dark:text-white">Become an author</h4>
									<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">Do you want to contribute by writing guest posts on this blog?</p>
									<p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Please contact us and send us a resume of previous articles that you have written.</p>
									<a className="text-white block text-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-full" href="/contact/">
										Get in touch
									</a>
								</div>
							</aside>
						</div>
					</div>
					<div className="w-full max-w-2xl mx-auto pt-14">
						<div className="divide-y divide-gray-200 dark:divide-gray-700">
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/tailwind-css/">
											#Tailwind CSS
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/figma/">
											#Figma
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1718705116000}>a month ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/e-commerce-ui-has-been-launched/">We have launched over 80+ components in E-commerce UI and there&apos;s more to come!</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">I am thrilled to share the latest updates from Flowbite! Since our last communication, our team has been hard at work, and we are excited to announce the launch of over 85 new E-commerce UI components and blocks.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/zoltan/">
										<img className="rounded-full w-7 h-7" src="https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp" alt="Zoltán Szőgyényi profile picture" />
										<span className="font-medium dark:text-white">Zoltán Szőgyényi</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/e-commerce-ui-has-been-launched/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1677146503000}>a year ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/state-of-flowbite-2022/">State of Flowbite: learn more about our results from 2022 and what we plan to build this year</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">Learn more about the results, achievements and plans for the future by reading the &quot;State of Flowbite 2022&quot; including the open-source development of the Flowbite Library, the release of new UI components, features, and more.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/zoltan/">
										<img className="rounded-full w-7 h-7" src="https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp" alt="Zoltán Szőgyényi profile picture" />
										<span className="font-medium dark:text-white">Zoltán Szőgyényi</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/state-of-flowbite-2022/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/laravel/">
											#Laravel
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/alpine-js/">
											#Alpine.js
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1673849524000}>2 years ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/how-to-use-flowbite-ui-components-with-laravel-and-alpine-js/">How to use Flowbite UI components with Laravel and Alpine.js to build an admin dashboard</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">In this tutorial, we&apos;re going to create a simple admin dashboard using free Flowbite UI components, Laravel, and a bit of Alpine.js for interactivity.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/rich/">
										<img className="rounded-full w-7 h-7" src="https://publisher.flowbite.com/content/images/2023/01/1605304654466.jpg" alt="Rich Klein profile picture" />
										<span className="font-medium dark:text-white">Rich Klein</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/how-to-use-flowbite-ui-components-with-laravel-and-alpine-js/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/next-js/">
											#Next.js
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1671533980000}>2 years ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/learn-how-to-use-flowbite-blocks-with-a-headless-next-js-cms/">Learn how to use Flowbite Blocks with Next.js and a Headless CMS</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">Get started with this guide to learn how to use the Flowbite Blocks collection together with a headless CMS based on Next.js</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/david/">
										<img className="rounded-full w-7 h-7" src="https://publisher.flowbite.com/content/images/2022/12/david-dumont-profile-picture.jpeg" alt="David Dumont profile picture" />
										<span className="font-medium dark:text-white">David Dumont</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/learn-how-to-use-flowbite-blocks-with-a-headless-next-js-cms/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/angular/">
											#Angular
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1667903925000}>2 years ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/top-10-scalable-angularjs-frameworks/">Top 10 Scalable AngularJS Frameworks for Your Next Web Development Project</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">Learn more about the most popular and scalable AngularJS frameworks by reading this article and how they can save you time developing advanced web applications.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/harikrishna/">
										<img className="rounded-full w-7 h-7" src="https://publisher.flowbite.com/content/images/2022/11/Author-Headshot.jpg" alt="Harikrishna Kundariya profile picture" />
										<span className="font-medium dark:text-white">Harikrishna Kundariya</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/top-10-scalable-angularjs-frameworks/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/tailwind-css/">
											#Tailwind CSS
										</a>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1666093551000}>2 years ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/tailwind-css-vs-bootstrap/">Bootstrap vs Tailwind CSS - what are the differences and which one should you choose?</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">Learn more about the differences between Bootstrap and Tailwind CSS in this article where we compare the usage and features of each CSS framework and which one to choose for your next project based on your needs.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/zoltan/">
										<img className="rounded-full w-7 h-7" src="https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp" alt="Zoltán Szőgyényi profile picture" />
										<span className="font-medium dark:text-white">Zoltán Szőgyényi</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/tailwind-css-vs-bootstrap/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
							<article className="py-6">
								<div className="flex items-center justify-between mb-3 text-gray-500">
									<div>
										<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
											#Flowbite
										</a>
									</div>
									<span className="text-sm">
										Published <time dateTime={1665745538000}>2 years ago</time>
									</span>
								</div>
								<h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white hover:underline">
									<a href="/blog/introducing-the-flowbite-blog-a-resource-by-the-community-for-the-community/">Introducing the Flowbite Blog - a brand new resource built for the community about web development and design</a>
								</h2>
								<p className="mb-5 text-gray-500 dark:text-gray-400">Read more about the introduction of a new resource in the Flowbite ecosystem, our own blog. Learn how you can also contribute to this new resource area.</p>
								<div className="flex items-center justify-between">
									<a className="flex items-center space-x-2" href="/blog/author/zoltan/">
										<img className="rounded-full w-7 h-7" src="https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp" alt="Zoltán Szőgyényi profile picture" />
										<span className="font-medium dark:text-white">Zoltán Szőgyényi</span>
									</a>
									<a className="inline-flex items-center font-medium text-blue-600 hover:underline dark:text-blue-500" href="/blog/introducing-the-flowbite-blog-a-resource-by-the-community-for-the-community/">
										Read more
										<svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
										</svg>
									</a>
								</div>
							</article>
						</div>
					</div>
					<aside className="hidden lg:block lg:w-80" aria-labelledby="sidebar-label">
						<div className="sticky top-36">
							<h3 id="sidebar-label" className="sr-only">
								Sidebar
							</h3>
							<div className="lg:ml-auto">
								<div id="carbonads">
									<span>
										<span className="carbon-wrap">
											<a href="https://srv.carbonads.net/ads/click/x/GTND427LCVYD52QUCAB4YKQUCV7DKK3YFTYIVZ3JCA7D627LCEAI45QKCAYDE5QEC67DL23MCY7D65QLF67DV5QKC6SI6KJECAYDEK3EHJNCLSIZ" className="carbon-img" target="_blank" rel="noopener sponsored">
												<img src="https://srv.carbonads.net/static/30242/719965462940ad21c4bd0152867ef8e38cb4fc3f" alt="ads via Carbon" border={0} height={100} width={130} data-no-statview="no" style={{ maxWidth: 130 }} />
											</a>
											<a href="https://srv.carbonads.net/ads/click/x/GTND427LCVYD52QUCAB4YKQUCV7DKK3YFTYIVZ3JCA7D627LCEAI45QKCAYDE5QEC67DL23MCY7D65QLF67DV5QKC6SI6KJECAYDEK3EHJNCLSIZ" className="carbon-text" target="_blank" rel="noopener sponsored">
												Implement Auth0 in any app in just 5 minutes. Start building today.
											</a>
										</span>
										<a href="http://carbonads.net/?utm_source=flowbitedesign&utm_medium=ad_via_link&utm_campaign=in_unit&utm_term=carbon" className="carbon-poweredby" target="_blank" rel="noopener sponsored">
											ads via Carbon
										</a>
										<div className="carbon-pixels" style={{ display: "none" }}>
											<img src="https://segment.prod.bidr.io/associate-segment?buzz_key=dsp&segment_key=dsp-19103" border={0} height={1} width={1} alt="ads via Carbon" style={{ display: "none" }} />
											<img src="https://secure.adnxs.com/seg?add=37012074&t=2" border={0} height={1} width={1} alt="ads via Carbon" style={{ display: "none" }} />
										</div>
									</span>
								</div>
							</div>
							<div className="p-6 pb-4 mt-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
								<h4 className="mb-4 font-bold text-gray-900 uppercase dark:text-white">Recommended topics</h4>
								<div className="flex flex-wrap">
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/alpine-js/">
										#Alpine.js
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/angular/">
										#Angular
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/figma/">
										#Figma
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/flowbite/">
										#Flowbite
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/laravel/">
										#Laravel
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/next-js/">
										#Next.js
									</a>
									<a className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 hover:bg-blue-200 dark:hover:bg-blue-300 dark:text-blue-800 mb-2" href="/blog/tag/tailwind-css/">
										#Tailwind CSS
									</a>
								</div>
							</div>
							<div className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400">
								<h4 className="mb-4 font-bold text-gray-900 uppercase dark:text-white">Community authors</h4>
								<ul className="space-y-4 text-gray-500 dark:text-gray-400">
									<li>
										<a className="flex items-start" href="/blog/author/rich/">
											<div className="mr-3 shrink-0">
												<img className="w-6 h-6 mt-1 rounded-full" src="https://publisher.flowbite.com/content/images/2023/01/1605304654466.jpg" alt="Rich Klein profile picture" />
											</div>
											<div className="mr-3">
												<span className="block font-medium text-gray-900 dark:text-white">Rich Klein</span>
												<span className="text-sm">Technical writer, web developer, and customer success specialist.</span>
											</div>
										</a>
									</li>
									<li>
										<a className="flex items-start" href="/blog/author/zoltan/">
											<div className="mr-3 shrink-0">
												<img className="w-6 h-6 mt-1 rounded-full" src="https://www.gravatar.com/avatar/be85a3bc61ad70c85c9b3411dc07cb2d?s=250&r=x&d=mp" alt="Zoltán Szőgyényi profile picture" />
											</div>
											<div className="mr-3">
												<span className="block font-medium text-gray-900 dark:text-white">Zoltán Szőgyényi</span>
												<span className="text-sm">Open-source contributor. Currently building Flowbite.</span>
											</div>
										</a>
									</li>
									<li>
										<a className="flex items-start" href="/blog/author/harikrishna/">
											<div className="mr-3 shrink-0">
												<img className="w-6 h-6 mt-1 rounded-full" src="https://publisher.flowbite.com/content/images/2022/11/Author-Headshot.jpg" alt="Harikrishna Kundariya profile picture" />
											</div>
											<div className="mr-3">
												<span className="block font-medium text-gray-900 dark:text-white">Harikrishna Kundariya</span>
												<span className="text-sm">Marketer, developer, IoT, ChatBot &amp; Blockchain savvy, CEO of eSparkBiz.</span>
											</div>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</aside>
				</div>
			</main>
		</>
	);
}
