const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
	info: (...args) => {
		if (isDevelopment) {
			console.log(...args);
		}
	},
	warn: (...args) => {
		if (isDevelopment) {
			console.warn(...args);
		}
	},
	error: (...args) => {
		// Always log errors, even in production
		console.error(...args);
	},
	debug: (...args) => {
		if (isDevelopment) {
			console.debug(...args);
		}
	},
};

export default logger;
