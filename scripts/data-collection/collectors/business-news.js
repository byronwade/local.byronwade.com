/**
 * Business News Daily API Collector (AllThingsDev)
 *
 * PREMIUM DATA SOURCE - Real-time business intelligence
 * Collects latest business news, financial updates, and market insights
 *
 * Features:
 * - Real-time business and financial news
 * - Breaking headlines with detailed subheadlines
 * - Market updates and stock information
 * - Company-specific news and developments
 * - Economic updates and business trends
 * - News images and media content
 *
 * Use Cases:
 * - Enhanced business profiles with recent news
 * - Market intelligence and trend analysis
 * - Company reputation monitoring
 * - Business development insights
 * - Competitive intelligence gathering
 * - Investment research and analysis
 *
 * Performance: Ideal for adding business intelligence context to collected data
 */

import axios from "axios";
import { RateLimiterManager } from "../utils/rate-limiter.js";
import { CacheManager } from "../utils/cache-manager.js";
import { Logger } from "../utils/error-handler.js";

export class BusinessNewsCollector {
	constructor() {
		this.rateLimiter = RateLimiterManager.getLimiter("business_news");
		this.logger = new Logger("BusinessNewsCollector");
		this.cache = CacheManager;

		// API configuration
		this.apiConfig = {
			baseUrl: "https://Business-News-Daily.proxy-production.allthingsdev.co",
			endpoints: {
				getAllNews: "/api/news",
			},
			headers: {
				Authorization: process.env.ALLTHINGSDEV_API_KEY || "",
				"Content-Type": "application/json",
			},
		};

		// Business news categories for filtering
		this.newsCategories = ["earnings", "ipo", "merger", "acquisition", "funding", "partnership", "expansion", "bankruptcy", "leadership", "product launch", "regulation", "market", "technology"];

		// Company name patterns for matching
		this.companyPatterns = {
			// Common company suffixes
			suffixes: ["Inc", "LLC", "Corp", "Company", "Co", "Ltd", "LP", "LLP"],
			// Common business terms
			businessTerms: ["Group", "Holdings", "Enterprises", "Industries", "Systems", "Solutions"],
		};
	}

	/**
	 * Get all current business news
	 * Returns comprehensive business news feed
	 */
	async getAllBusinessNews(options = {}) {
		const cacheKey = `business_news_all_${Date.now() - (Date.now() % (15 * 60 * 1000))}`; // 15-minute cache buckets

		try {
			// Check cache first (shorter cache for news)
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Business news cache hit`);
				return cached;
			}

			await this.rateLimiter.waitForToken();

			const startTime = performance.now();
			this.logger.info(`Fetching latest business news`);

			const response = await axios.get(`${this.apiConfig.baseUrl}${this.apiConfig.endpoints.getAllNews}`, {
				headers: this.apiConfig.headers,
				timeout: 30000,
			});

			if (response.status !== 200 || !Array.isArray(response.data)) {
				throw new Error(`Unexpected response: ${response.status}`);
			}

			// Process and normalize the news data
			const newsArticles = response.data.map((article) => this.normalizeNewsArticle(article));

			// Filter and categorize articles
			const processedNews = this.categorizeNews(newsArticles);

			const queryTime = performance.now() - startTime;
			this.logger.performance(`Business news fetch completed in ${queryTime.toFixed(2)}ms`);
			this.logger.info(`Retrieved ${newsArticles.length} business news articles`);

			// Cache for 15 minutes (news is time-sensitive)
			await this.cache.set(cacheKey, processedNews, 15 * 60 * 1000);

			return processedNews;
		} catch (error) {
			this.logger.error(`Business news fetch failed: ${error.message}`);

			if (error.response?.status === 401) {
				throw new Error("Invalid AllThingsDev API key for Business News");
			} else if (error.response?.status === 429) {
				throw new Error("Business News API rate limit exceeded");
			}

			throw error;
		}
	}

	/**
	 * Search for news articles mentioning specific companies
	 * Useful for company-specific business intelligence
	 */
	async getCompanyNews(companyName, options = {}) {
		const cacheKey = `business_news_company_${companyName.toLowerCase()}_${Date.now() - (Date.now() % (30 * 60 * 1000))}`; // 30-minute cache

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				this.logger.info(`Company news cache hit for: ${companyName}`);
				return cached;
			}

			// Get all news first
			const allNews = await this.getAllBusinessNews(options);

			// Filter for company-specific news
			const companyNews = this.filterNewsByCompany(allNews.articles, companyName);

			const result = {
				company: companyName,
				articles: companyNews,
				total_articles: companyNews.length,
				categories: this.extractNewsCategories(companyNews),
				sentiment: this.analyzeNewsSentiment(companyNews),
				last_updated: new Date().toISOString(),
			};

			this.logger.info(`Found ${companyNews.length} news articles for: ${companyName}`);

			// Cache for 30 minutes
			await this.cache.set(cacheKey, result, 30 * 60 * 1000);

			return result;
		} catch (error) {
			this.logger.error(`Company news search failed for ${companyName}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Get industry-specific business news
	 * Filter news by industry keywords and trends
	 */
	async getIndustryNews(industry, options = {}) {
		const cacheKey = `business_news_industry_${industry.toLowerCase()}_${Date.now() - (Date.now() % (30 * 60 * 1000))}`;

		try {
			const cached = await this.cache.get(cacheKey);
			if (cached && !options.force) {
				return cached;
			}

			// Get all news first
			const allNews = await this.getAllBusinessNews(options);

			// Filter for industry-specific news
			const industryNews = this.filterNewsByIndustry(allNews.articles, industry);

			const result = {
				industry: industry,
				articles: industryNews,
				total_articles: industryNews.length,
				trending_topics: this.extractTrendingTopics(industryNews),
				sentiment: this.analyzeNewsSentiment(industryNews),
				last_updated: new Date().toISOString(),
			};

			this.logger.info(`Found ${industryNews.length} news articles for industry: ${industry}`);

			// Cache for 30 minutes
			await this.cache.set(cacheKey, result, 30 * 60 * 1000);

			return result;
		} catch (error) {
			this.logger.error(`Industry news search failed for ${industry}: ${error.message}`);
			throw error;
		}
	}

	/**
	 * Normalize news article data into our standard format
	 */
	normalizeNewsArticle(article) {
		try {
			return {
				// Basic Information
				headline: article.headLine || article.headline,
				subheadline: article.subHeadline || article.subheadline,
				content: article.subHeadline || article.content || "", // Use subheadline as content

				// Publication Details
				published_date: this.parseNewsDate(article.date),
				news_link: article.newsLink || article.url,
				source: this.extractSourceFromUrl(article.newsLink),

				// Media
				headline_image: article.headlineImage || article.image,

				// Analysis
				companies_mentioned: this.extractCompanyMentions(article.headLine, article.subHeadLine),
				categories: this.categorizeArticle(article.headLine, article.subHeadLine),
				sentiment: this.analyzeSentiment(article.headLine, article.subHeadLine),

				// Metadata
				word_count: (article.subHeadLine || "").split(" ").length,
				data_source: "business_news_allthingsdev",
				last_updated: new Date().toISOString(),

				// Original data
				raw_data: article,
			};
		} catch (error) {
			this.logger.warn(`Failed to normalize news article: ${error.message}`);
			return null;
		}
	}

	/**
	 * Parse news date from various formats
	 */
	parseNewsDate(dateString) {
		if (!dateString) return null;

		try {
			// Handle format like "May 18, 2024 01:55 PM IST"
			const cleanDate = dateString.replace(/\s+(IST|EST|PST|CST|GMT|UTC)$/, "");
			const parsedDate = new Date(cleanDate);

			if (isNaN(parsedDate.getTime())) {
				this.logger.warn(`Could not parse date: ${dateString}`);
				return null;
			}

			return parsedDate.toISOString();
		} catch (error) {
			this.logger.warn(`Date parsing error: ${error.message}`);
			return null;
		}
	}

	/**
	 * Extract source name from news URL
	 */
	extractSourceFromUrl(url) {
		if (!url) return "Unknown";

		try {
			const urlObj = new URL(url);
			const hostname = urlObj.hostname.toLowerCase();

			// Common business news sources
			const sourceMap = {
				"moneycontrol.com": "MoneyControl",
				"bloomberg.com": "Bloomberg",
				"reuters.com": "Reuters",
				"wsj.com": "Wall Street Journal",
				"ft.com": "Financial Times",
				"cnbc.com": "CNBC",
				"marketwatch.com": "MarketWatch",
				"businessinsider.com": "Business Insider",
			};

			for (const [domain, source] of Object.entries(sourceMap)) {
				if (hostname.includes(domain)) {
					return source;
				}
			}

			// Extract main domain
			const parts = hostname.split(".");
			return parts[parts.length - 2] || hostname;
		} catch (error) {
			return "Unknown";
		}
	}

	/**
	 * Extract company mentions from news text
	 */
	extractCompanyMentions(headline, subheadline) {
		const text = `${headline || ""} ${subheadline || ""}`.toLowerCase();
		const companies = [];

		// Look for capitalized company names
		const words = text.split(/\s+/);
		let currentCompany = [];

		for (let i = 0; i < words.length; i++) {
			const word = words[i];

			// Check if word starts with capital letter (in original text)
			const originalWord = `${headline || ""} ${subheadline || ""}`.split(/\s+/)[i];

			if (originalWord && /^[A-Z]/.test(originalWord)) {
				currentCompany.push(originalWord);

				// Check if next word is a company suffix
				const nextWord = words[i + 1];
				if (nextWord && this.companyPatterns.suffixes.some((suffix) => nextWord.toLowerCase().includes(suffix.toLowerCase()))) {
					currentCompany.push(words[i + 1]);
					i++; // Skip next word
				}

				// Add company if we have enough words
				if (currentCompany.length >= 1) {
					companies.push(currentCompany.join(" "));
				}
				currentCompany = [];
			} else {
				if (currentCompany.length > 0) {
					companies.push(currentCompany.join(" "));
					currentCompany = [];
				}
			}
		}

		// Filter out common words that aren't companies
		const filteredCompanies = companies.filter((company) => company.length > 2 && !["The", "And", "For", "With"].includes(company));

		return [...new Set(filteredCompanies)]; // Remove duplicates
	}

	/**
	 * Categorize news articles by content
	 */
	categorizeArticle(headline, subheadline) {
		const text = `${headline || ""} ${subheadline || ""}`.toLowerCase();
		const categories = [];

		// Define category keywords
		const categoryKeywords = {
			earnings: ["profit", "revenue", "earnings", "quarterly", "q1", "q2", "q3", "q4", "fiscal"],
			merger_acquisition: ["merger", "acquisition", "acquired", "buyout", "takeover", "deal"],
			funding: ["funding", "investment", "capital", "raised", "series", "ipo", "public"],
			leadership: ["ceo", "president", "director", "executive", "appointed", "resigned"],
			product: ["launched", "product", "service", "platform", "announced", "released"],
			financial: ["stock", "share", "market", "trading", "price", "valuation"],
			regulation: ["regulation", "compliance", "legal", "court", "lawsuit", "settlement"],
			expansion: ["expansion", "growth", "opened", "partnership", "contract", "agreement"],
		};

		for (const [category, keywords] of Object.entries(categoryKeywords)) {
			if (keywords.some((keyword) => text.includes(keyword))) {
				categories.push(category);
			}
		}

		return categories.length > 0 ? categories : ["general_business"];
	}

	/**
	 * Analyze sentiment of news article
	 */
	analyzeSentiment(headline, subheadline) {
		const text = `${headline || ""} ${subheadline || ""}`.toLowerCase();

		// Simple sentiment analysis based on keywords
		const positiveWords = ["growth", "profit", "success", "increase", "up", "gain", "positive", "strong", "beat", "exceeded", "surge", "boom", "expansion", "recovery"];

		const negativeWords = ["loss", "decline", "down", "fall", "drop", "crash", "crisis", "bankruptcy", "failed", "lawsuit", "scandal", "warning", "concerns"];

		let positiveScore = 0;
		let negativeScore = 0;

		positiveWords.forEach((word) => {
			if (text.includes(word)) positiveScore++;
		});

		negativeWords.forEach((word) => {
			if (text.includes(word)) negativeScore++;
		});

		if (positiveScore > negativeScore) {
			return "positive";
		} else if (negativeScore > positiveScore) {
			return "negative";
		} else {
			return "neutral";
		}
	}

	/**
	 * Categorize all news articles
	 */
	categorizeNews(articles) {
		const categorized = {
			articles: articles.filter(Boolean), // Remove null articles
			categories: {},
			sources: {},
			sentiment_distribution: { positive: 0, negative: 0, neutral: 0 },
			total_articles: 0,
		};

		categorized.articles.forEach((article) => {
			// Count categories
			article.categories.forEach((category) => {
				categorized.categories[category] = (categorized.categories[category] || 0) + 1;
			});

			// Count sources
			categorized.sources[article.source] = (categorized.sources[article.source] || 0) + 1;

			// Count sentiment
			categorized.sentiment_distribution[article.sentiment]++;
		});

		categorized.total_articles = categorized.articles.length;

		return categorized;
	}

	/**
	 * Filter news by company name
	 */
	filterNewsByCompany(articles, companyName) {
		const searchTerms = [
			companyName.toLowerCase(),
			companyName.toLowerCase().replace(/\s+(inc|llc|corp|company|co|ltd)$/i, ""),
			companyName.toLowerCase().split(" ")[0], // First word of company name
		];

		return articles.filter((article) => {
			const text = `${article.headline} ${article.subheadline} ${article.companies_mentioned.join(" ")}`.toLowerCase();

			return searchTerms.some((term) => text.includes(term)) || article.companies_mentioned.some((company) => company.toLowerCase().includes(companyName.toLowerCase()));
		});
	}

	/**
	 * Filter news by industry
	 */
	filterNewsByIndustry(articles, industry) {
		const industryKeywords = {
			technology: ["tech", "software", "digital", "ai", "artificial intelligence", "cloud", "data"],
			healthcare: ["health", "medical", "pharma", "biotech", "hospital", "drug"],
			finance: ["bank", "financial", "fintech", "insurance", "investment", "credit"],
			retail: ["retail", "store", "shopping", "consumer", "e-commerce", "sales"],
			energy: ["energy", "oil", "gas", "renewable", "solar", "wind", "power"],
			automotive: ["auto", "car", "vehicle", "automotive", "transport", "mobility"],
			real_estate: ["real estate", "property", "housing", "construction", "development"],
		};

		const keywords = industryKeywords[industry.toLowerCase()] || [industry.toLowerCase()];

		return articles.filter((article) => {
			const text = `${article.headline} ${article.subheadline}`.toLowerCase();
			return keywords.some((keyword) => text.includes(keyword));
		});
	}

	/**
	 * Extract trending topics from news articles
	 */
	extractTrendingTopics(articles) {
		const wordCount = {};

		articles.forEach((article) => {
			const text = `${article.headline} ${article.subheadline}`.toLowerCase();
			const words = text.split(/\s+/).filter((word) => word.length > 3 && !["the", "and", "for", "with", "that", "this"].includes(word));

			words.forEach((word) => {
				wordCount[word] = (wordCount[word] || 0) + 1;
			});
		});

		// Get top 10 trending words
		return Object.entries(wordCount)
			.sort(([, a], [, b]) => b - a)
			.slice(0, 10)
			.map(([word, count]) => ({ word, count }));
	}

	/**
	 * Extract news categories from articles
	 */
	extractNewsCategories(articles) {
		const categoryCount = {};

		articles.forEach((article) => {
			article.categories.forEach((category) => {
				categoryCount[category] = (categoryCount[category] || 0) + 1;
			});
		});

		return Object.entries(categoryCount)
			.sort(([, a], [, b]) => b - a)
			.map(([category, count]) => ({ category, count }));
	}

	/**
	 * Analyze overall sentiment of news articles
	 */
	analyzeNewsSentiment(articles) {
		if (articles.length === 0) return "neutral";

		const sentimentCount = { positive: 0, negative: 0, neutral: 0 };

		articles.forEach((article) => {
			sentimentCount[article.sentiment]++;
		});

		const total = articles.length;
		return {
			positive: ((sentimentCount.positive / total) * 100).toFixed(1),
			negative: ((sentimentCount.negative / total) * 100).toFixed(1),
			neutral: ((sentimentCount.neutral / total) * 100).toFixed(1),
			overall: sentimentCount.positive > sentimentCount.negative ? "positive" : sentimentCount.negative > sentimentCount.positive ? "negative" : "neutral",
		};
	}

	/**
	 * Get collector statistics
	 */
	getStats() {
		return {
			rateLimiter: this.rateLimiter.getStats(),
			cache: this.cache.getStats(),
			apiEndpoint: this.apiConfig.baseUrl,
			supportedCategories: this.newsCategories,
			supportedAnalysis: ["company_mentions", "sentiment_analysis", "category_classification", "trending_topics"],
		};
	}
}

export default BusinessNewsCollector;
