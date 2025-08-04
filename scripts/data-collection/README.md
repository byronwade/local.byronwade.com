# Business Data Collection System

An intelligent, performance-first business data collection system that gathers comprehensive business information from multiple APIs and populates the Supabase database with enriched business profiles.

## 🚀 Features

- **Multi-API Integration**: Google Places, Yelp, Foursquare, Overpass API, and more
- **AI-Powered Enrichment**: Uses OpenAI to enhance and validate business data
- **Performance Optimized**: Rate limiting, caching, and batch processing
- **Top 500 Focus**: Prioritizes Fortune 500 and major businesses with detailed data
- **Unclaimed Business Model**: All businesses start as unclaimed for user claiming

## 📁 Structure

```
scripts/data-collection/
├── README.md                    # This file
├── config/
│   ├── apis.js                 # API configurations and keys
│   ├── business-lists.js       # Fortune 500 and business lists
│   └── categories.js           # Business category mappings
├── collectors/
│   ├── google-places.js        # Google Places API collector
│   ├── yelp.js                 # Yelp API collector
│   ├── foursquare.js          # Foursquare API collector
│   ├── overpass.js            # OpenStreetMap Overpass API
│   └── web-scraper.js         # Intelligent web scraping
├── enrichers/
│   ├── ai-enhancer.js         # OpenAI-powered data enhancement
│   ├── geocoder.js            # Address geocoding and validation
│   ├── image-processor.js     # Business photo processing
│   └── social-media.js        # Social media data extraction
├── processors/
│   ├── data-merger.js         # Intelligent data merging from multiple sources
│   ├── validator.js           # Data validation and cleaning
│   └── deduplicator.js        # Duplicate business detection
├── database/
│   ├── supabase-client.js     # Optimized Supabase operations
│   ├── batch-inserter.js      # Performance-optimized batch inserts
│   └── business-populator.js  # Main database population logic
├── utils/
│   ├── rate-limiter.js        # API rate limiting utilities
│   ├── cache-manager.js       # Intelligent caching system
│   ├── error-handler.js       # Comprehensive error handling
│   └── performance-monitor.js # Performance tracking
└── main.js                    # Main orchestration script
```

## 🔧 Usage

### Quick Start
```bash
# Install dependencies (if needed)
bun install

# Run the full data collection for top 500 businesses
bun run scripts/data-collection/main.js --mode=top500

# Run for specific geographic area
bun run scripts/data-collection/main.js --mode=geographic --location="San Francisco, CA" --radius=50

# Run for specific business categories
bun run scripts/data-collection/main.js --mode=category --categories="restaurants,retail,healthcare"

# Test run with limited data
bun run scripts/data-collection/main.js --mode=test --limit=10
```

### Advanced Options
```bash
# Enable verbose logging
bun run scripts/data-collection/main.js --mode=top500 --verbose

# Skip AI enrichment for faster processing
bun run scripts/data-collection/main.js --mode=top500 --skip-ai

# Only update existing businesses
bun run scripts/data-collection/main.js --mode=update --existing-only

# Dry run (no database changes)
bun run scripts/data-collection/main.js --mode=top500 --dry-run
```

## 📊 Data Sources

### Primary APIs
1. **Google Places API** - Comprehensive business data, photos, reviews
2. **Yelp Fusion API** - Review data, business hours, photos
3. **Foursquare Places API** - Location data, tips, photos
4. **Overpass API** (OpenStreetMap) - Free geographic business data

### Secondary Sources
1. **Web Scraping** - Business websites for additional details
2. **Social Media APIs** - Instagram, Facebook business pages
3. **Government Databases** - Business registration data
4. **Industry Databases** - Fortune 500, Inc 5000 lists

### AI Enhancement
- **OpenAI GPT-4** - Business description enhancement, categorization
- **Image Analysis** - Business photo categorization and validation
- **Data Validation** - Consistency checks and data quality improvements

## 🎯 Business Prioritization

### Top 500 Businesses (Detailed Data)
- Fortune 500 companies
- Major retail chains
- Popular restaurant chains
- Healthcare systems
- Educational institutions
- Government offices

### Geographic Coverage
- Major metropolitan areas first
- Population-based expansion
- Tourist destinations
- Economic centers

### Category Focus
- Restaurants & Food Service
- Retail & Shopping
- Healthcare & Medical
- Professional Services
- Entertainment & Recreation
- Automotive Services

## 🔒 Security & Compliance

- API keys stored securely in environment variables
- Rate limiting to respect API terms of service
- Data validation and sanitization
- GDPR and privacy compliance considerations
- Audit logging for all data collection activities

## 📈 Performance Metrics

- **Target Rate**: 1000+ businesses per hour
- **Data Quality**: 95%+ completeness for top 500
- **API Efficiency**: <50% of rate limits used
- **Error Rate**: <1% failed requests
- **Cache Hit Rate**: >80% for repeated data

## 🚨 Monitoring & Alerts

- Real-time performance monitoring
- API quota tracking
- Error rate monitoring
- Data quality alerts
- Database performance tracking