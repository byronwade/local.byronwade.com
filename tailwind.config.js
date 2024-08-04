/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}"],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			ringWidth: {
				0: "0px",
			},
			colors: {
				dark: {
					100: "#f5f5f5",
					200: "#e5e5e5",
					300: "#d4d4d4",
					400: "#a3a3a3",
					500: "#737373",
					600: "#525252",
					700: "#404040",
					800: "#262626",
					900: "#171717",
					950: "#111111",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				breathe: {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.20)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"spin-slow": "spin 1s linear infinite",
				breathe: "breathe 1s ease-in-out infinite",
			},
		},
	},

	variants: {
		extend: {
			ringWidth: ["focus-visible"],
			ringColor: ["focus-visible"],
			ringOffsetWidth: ["focus-visible"],
		},
	},
	plugins: [
		function ({ addUtilities }) {
			const newUtilities = {
				".scrollbar-hide": {
					/* Hide scrollbar for Chrome, Safari and Opera */
					"&::-webkit-scrollbar": {
						display: "none",
					},
					/* Hide scrollbar for IE, Edge and Firefox */
					"-ms-overflow-style": "none",
					"scrollbar-width": "none",
				},
			};

			addUtilities(newUtilities, ["responsive", "hover"]);
		},
		require("@tailwindcss/typography"),
		require("tailwindcss-animate"),
		require("@tailwindcss/forms"),
		function ({ addBase, config }) {
			addBase({
				"input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill": {
					"-webkit-box-shadow": `0 0 0px 1000px ${config("theme.colors.white")} inset`,
					boxShadow: `0 0 0px 1000px ${config("theme.colors.white")} inset`,
					"-webkit-text-fill-color": config("theme.colors.black"),
					transition: "background-color 5000s ease-in-out 0s",
				},
				"@media (prefers-color-scheme: dark)": {
					"input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill": {
						"-webkit-box-shadow": `0 0 0px 1000px ${config("theme.colors.gray.900")} inset`,
						boxShadow: `0 0 0px 1000px ${config("theme.colors.gray.900")} inset`,
						"-webkit-text-fill-color": config("theme.colors.white"),
					},
				},
			});
		},
	],
};
  