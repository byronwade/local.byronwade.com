# 🤖 Intelligent Database Seeding

An advanced seeding system inspired by [Tighten's best practices](https://tighten.com/insights/10-efficient-and-fun-ways-to-seed-your-database/) that generates realistic business data using real APIs, AI-enhanced content, and smart algorithms.

## 🌟 Features

### 📊 **Real Business Data Integration**
- **Google Places API**: Fetches actual businesses from real locations
- **Intelligent Fallback**: Enhanced fake data when APIs aren't available
- **Smart Caching**: Cached API responses to prevent redundant calls
- **Rate Limiting**: Respects API limits with intelligent delays

### 🎯 **Location-Aware Seeding**
- **8 Major Cities**: San Francisco, NYC, LA, Chicago, Austin, Seattle, Denver, Miami
- **Geographic Distribution**: Businesses spread realistically across cities
- **Category Mapping**: Different business types per location
- **Coordinate Accuracy**: Real latitude/longitude for mapping

### 🤖 **AI-Enhanced Content**
- **Contextual Descriptions**: Business descriptions tailored to category
- **Realistic Amenities**: Category-appropriate features and services
- **Smart Specialties**: Industry-specific highlights
- **Social Media Integration**: Automatic handle generation

### 💬 **Interactive Seeding**
- **User Prompts**: Choose real data vs enhanced fake data
- **City Selection**: Target specific regions or all cities
- **Category Control**: Focus on specific business types
- **Progress Feedback**: Real-time seeding status

## 🚀 Quick Start

### 1. Basic Seeding (No API Required)
```bash
bun run seed:database
```
Answer "no" to API prompts to use enhanced fake data.

### 2. Real Data Seeding (API Required)
```bash
# Add to .env.local:
GOOGLE_PLACES_API_KEY=your_api_key_here

bun run seed:database
```
Answer "yes" to use real business data from Google Places.

## 🔧 Configuration

### Environment Variables
Add these to your `.env.local` file:

```env
# Required for real business data
GOOGLE_PLACES_API_KEY=your_google_places_api_key_here

# Optional additional sources
YELP_API_KEY=your_yelp_api_key_here
FOURSQUARE_API_KEY=your_foursquare_api_key_here
```

### Seeding Settings
Modify `INTELLIGENT_SEEDING` in `lib/supabase/seed.mjs`:

```javascript
const INTELLIGENT_SEEDING = {
	useRealBusinessData: true,      // Enable API fetching
	useAIGeneration: true,          // Enhanced content generation
	interactive: true,              // Show user prompts
	cacheApiResponses: true,        // Cache API calls
	apiRateLimit: 100,             // Requests per minute
};
```

## 📍 Target Cities

| City | State | Categories | Businesses |
|------|--------|------------|------------|
| San Francisco | CA | Tech, Food, Retail | 25+ per category |
| New York | NY | Finance, Arts, Dining | 25+ per category |
| Los Angeles | CA | Entertainment, Food | 25+ per category |
| Chicago | IL | Industry, Services | 25+ per category |
| Austin | TX | Music, Tech, Food | 25+ per category |
| Seattle | WA | Tech, Coffee, Outdoor | 25+ per category |
| Denver | CO | Outdoor, Beer, Health | 25+ per category |
| Miami | FL | Hospitality, Beach, Nightlife | 25+ per category |

## 🏢 Business Categories

### **Restaurants** 🍽️
- Italian, Mexican, Japanese, American
- Pizza, Burgers, Coffee, Bakery
- **Hours**: 11 AM - 10 PM (extended weekends)
- **Amenities**: Outdoor seating, delivery, takeout

### **Retail** 🛍️
- Clothing, Electronics, Books, Jewelry
- Shoes, Furniture, Grocery
- **Hours**: 10 AM - 8 PM (extended weekends)
- **Amenities**: Free WiFi, parking, returns

### **Services** 🔧
- Hair salon, Auto repair, Cleaning
- Legal, Accounting, Consulting
- **Hours**: 8 AM - 5 PM (limited weekends)
- **Amenities**: Appointments, parking

### **Health** ⚕️
- Dentist, Doctor, Pharmacy
- Fitness, Spa, Veterinarian
- **Hours**: 8 AM - 5 PM (Saturday mornings)
- **Amenities**: Insurance accepted, wheelchair accessible

### **Entertainment** 🎭
- Movie theater, Bowling, Arcade
- Bar, Nightclub, Museum
- **Hours**: Variable (evenings/weekends)
- **Amenities**: Group bookings, events

### **Education** 📚
- School, Tutoring, Music lessons
- Language school, Training
- **Hours**: 9 AM - 5 PM (weekdays only)
- **Amenities**: Online booking, certified instructors

## 🎯 Smart Features

### **Realistic Business Names**
- Location-based: "The San Francisco Italian Kitchen"
- Owner-based: "Smith's Auto Repair"
- Descriptive: "Fresh Bean Coffee Co."

### **Category-Appropriate Hours**
- **Restaurants**: Late evenings, weekend focus
- **Retail**: Standard business hours, weekend shopping
- **Health**: Professional hours, limited weekends
- **Services**: Weekday focus, emergency availability

### **Intelligent Content Generation**
- **Descriptions**: Tailored to business type and location
- **Amenities**: Category-specific features
- **Social Media**: Realistic handle generation
- **Reviews**: Authentic review patterns

### **Geographic Accuracy**
- **Real Coordinates**: Actual business locations when using APIs
- **City Clustering**: Businesses distributed within city boundaries
- **Address Generation**: Street addresses matching city/state

## 📊 Data Quality

### **Real Business Data** (with API keys)
- ✅ **Authentic Names**: Real business names from Google Places
- ✅ **Accurate Locations**: Precise coordinates and addresses
- ✅ **Verified Ratings**: Actual customer ratings
- ✅ **Real Photos**: Business photos from Google Places

### **Enhanced Fake Data** (without API keys)
- ✅ **Realistic Names**: AI-generated business names
- ✅ **Geographic Distribution**: City-appropriate locations
- ✅ **Category Accuracy**: Business types matching locations
- ✅ **Contextual Content**: Industry-specific descriptions

## 🎮 Interactive Options

When running in development mode, you'll see prompts like:

```
🚀 Starting Intelligent Business Seeding...
Do you want to use real business data from APIs? (y/n): y

🏙️  Available cities for real business data:
1. San Francisco, CA
2. New York, NY
3. Los Angeles, CA
...

Select cities to fetch businesses from:
1. All cities
2. Major metros only
3. West Coast
4. East Coast
5. Custom selection
Choose an option (number): 2
```

## 📁 Caching System

API responses are automatically cached in `database/cache/`:

```
database/cache/
├── businesses_San Francisco_restaurants_20.json
├── businesses_New York_retail_20.json
└── businesses_Los Angeles_entertainment_20.json
```

Benefits:
- ⚡ **Faster Subsequent Runs**: No redundant API calls
- 💰 **API Cost Savings**: Reduce billable API requests
- 🔄 **Offline Development**: Work without API connectivity
- 🧹 **Easy Cleanup**: Delete cache folder to refresh data

## 🔥 Performance Optimizations

### **Batch Processing**
- Multiple businesses per API call
- Concurrent category processing
- City-parallel execution

### **Rate Limiting**
- 100ms delays between API calls
- Configurable rate limits
- Graceful degradation on limits

### **Memory Management**
- Streaming data processing
- Garbage collection optimization
- Memory usage monitoring

### **Error Handling**
- Graceful API failure recovery
- Automatic fallback to fake data
- Partial success continuation

## 🧪 Testing Modes

### **Development Mode**
```bash
NODE_ENV=development bun run seed:database
```
- Interactive prompts enabled
- Detailed progress logging
- Cache debugging information

### **Production Mode**
```bash
NODE_ENV=production bun run seed:database
```
- Automatic mode selection
- Minimal logging output
- Optimized performance

### **Staging Mode**
```bash
NODE_ENV=staging bun run seed:database
```
- Reduced data volume
- Fast seeding focus
- Performance optimized

## 📈 Results

After intelligent seeding, you'll have:

- 🏢 **200 Realistic Businesses** across 8 major cities
- 📍 **Geographic Accuracy** with real coordinates
- 🎯 **Category Distribution** across 6 business types
- ⭐ **Quality Ratings** based on real data patterns
- 📝 **Rich Descriptions** with AI-enhanced content
- 📱 **Social Media** profiles with realistic handles
- 🕒 **Business Hours** appropriate to category
- 💳 **Payment Methods** matching business type
- 🏷️ **Realistic Tags** for search optimization

## 🤝 Contributing

Want to add more cities or business categories? Check out:

- `TARGET_CITIES` - Add new cities with coordinates
- `REAL_BUSINESS_CATEGORIES` - Add new business types
- `IntelligentSeeder` class - Extend functionality

## 📚 Learn More

This system implements advanced seeding strategies from:
- [Tighten's Database Seeding Guide](https://tighten.com/insights/10-efficient-and-fun-ways-to-seed-your-database/)
- Google Places API Documentation
- AI Content Generation Best Practices
- Geographic Data Distribution Techniques

---

**Ready to seed your database with intelligence? Run `bun run seed:database` and follow the prompts!** 🚀