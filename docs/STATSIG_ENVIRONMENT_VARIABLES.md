# Statsig Environment Variables Configuration

This document outlines all environment variables required for Statsig analytics integration with session replay and web analytics features.

## Required Environment Variables

### Core Statsig Configuration

```bash
# Enable/disable Statsig analytics
STATSIG_ENABLED=true

# Statsig Client API Key (Public)
# This is safe to expose in client-side code
NEXT_PUBLIC_STATSIG_CLIENT_API_KEY=client-VsAq7asJFuh6SPJcpxzF9ylksLIeeqlHdA7phaHzwbj
```

### Session Replay Configuration

```bash
# Enable/disable session replay feature
STATSIG_SESSION_REPLAY_ENABLED=true

# Sample rate for session replay (0.0 to 1.0)
# 0.1 = 10% of sessions will be recorded
STATSIG_SESSION_REPLAY_SAMPLE_RATE=0.1
```

### Web Analytics Configuration

```bash
# Enable/disable web analytics auto-capture
STATSIG_WEB_ANALYTICS_ENABLED=true

# Enable/disable automatic event capture (clicks, forms, page views)
STATSIG_AUTO_CAPTURE_ENABLED=true
```

### Performance Budget Configuration

```bash
# Maximum initialization time in milliseconds
STATSIG_MAX_INIT_TIME=100

# Maximum event processing time in milliseconds
STATSIG_MAX_EVENT_TIME=50
```

### Global Analytics Performance Settings

```bash
# Enable event batching for performance
ANALYTICS_BATCH_EVENTS=true

# Number of events to batch before sending
ANALYTICS_BATCH_SIZE=10

# Flush interval in milliseconds
ANALYTICS_FLUSH_INTERVAL=5000

# Maximum number of retries for failed requests
ANALYTICS_MAX_RETRIES=3
```

## Environment Variable Hierarchy

### Development (.env.local)
```bash
# Development settings - lower sample rates for testing
STATSIG_ENABLED=true
NEXT_PUBLIC_STATSIG_CLIENT_API_KEY=client-VsAq7asJFuh6SPJcpxzF9ylksLIeeqlHdA7phaHzwbj
STATSIG_SESSION_REPLAY_ENABLED=true
STATSIG_SESSION_REPLAY_SAMPLE_RATE=0.5
STATSIG_WEB_ANALYTICS_ENABLED=true
STATSIG_AUTO_CAPTURE_ENABLED=true
ANALYTICS_BATCH_EVENTS=true
ANALYTICS_BATCH_SIZE=5
ANALYTICS_FLUSH_INTERVAL=2000
```

### Staging (.env.staging)
```bash
# Staging settings - moderate sample rates
STATSIG_ENABLED=true
NEXT_PUBLIC_STATSIG_CLIENT_API_KEY=client-VsAq7asJFuh6SPJcpxzF9ylksLIeeqlHdA7phaHzwbj
STATSIG_SESSION_REPLAY_ENABLED=true
STATSIG_SESSION_REPLAY_SAMPLE_RATE=0.2
STATSIG_WEB_ANALYTICS_ENABLED=true
STATSIG_AUTO_CAPTURE_ENABLED=true
ANALYTICS_BATCH_EVENTS=true
ANALYTICS_BATCH_SIZE=10
ANALYTICS_FLUSH_INTERVAL=3000
```

### Production (.env.production)
```bash
# Production settings - optimized for performance and cost
STATSIG_ENABLED=true
NEXT_PUBLIC_STATSIG_CLIENT_API_KEY=client-VsAq7asJFuh6SPJcpxzF9ylksLIeeqlHdA7phaHzwbj
STATSIG_SESSION_REPLAY_ENABLED=true
STATSIG_SESSION_REPLAY_SAMPLE_RATE=0.05
STATSIG_WEB_ANALYTICS_ENABLED=true
STATSIG_AUTO_CAPTURE_ENABLED=true
ANALYTICS_BATCH_EVENTS=true
ANALYTICS_BATCH_SIZE=20
ANALYTICS_FLUSH_INTERVAL=5000
STATSIG_MAX_INIT_TIME=100
STATSIG_MAX_EVENT_TIME=50
```

## Integration with Existing Analytics

### PostHog Configuration (Future)
```bash
# PostHog settings (when implemented)
POSTHOG_ENABLED=true
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Google Analytics Configuration (Future)
```bash
# Google Analytics settings (when implemented)
GA_ENABLED=true
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## Performance Considerations

### Sample Rate Guidelines

| Environment | Session Replay | Recommended Reason |
|-------------|----------------|-------------------|
| Development | 0.5 (50%) | High sample rate for testing |
| Staging | 0.2 (20%) | Moderate for pre-production validation |
| Production | 0.05 (5%) | Low for cost optimization |

### Performance Budgets

| Metric | Target | Budget | Impact |
|--------|--------|--------|--------|
| Initialization Time | <50ms | <100ms | Page load performance |
| Event Processing | <20ms | <50ms | User interaction responsiveness |
| Bundle Size | <25KB | <50KB | Initial page load |

### Batch Configuration

| Environment | Batch Size | Flush Interval | Reasoning |
|-------------|------------|----------------|-----------|
| Development | 5 events | 2000ms | Faster feedback |
| Staging | 10 events | 3000ms | Balanced testing |
| Production | 20 events | 5000ms | Optimized performance |

## Security Best Practices

### Public vs Private Keys

- ✅ **NEXT_PUBLIC_STATSIG_CLIENT_API_KEY**: Safe to expose (client-side)
- ❌ **STATSIG_SERVER_SECRET_KEY**: Never expose (server-side only)

### Environment Variable Validation

The application validates all environment variables on startup:

```javascript
// Automatic validation in config/index.js
const requiredStatsigVars = [
  'NEXT_PUBLIC_STATSIG_CLIENT_API_KEY',
];

const optionalStatsigVars = [
  'STATSIG_ENABLED',
  'STATSIG_SESSION_REPLAY_ENABLED',
  'STATSIG_WEB_ANALYTICS_ENABLED',
];
```

## Monitoring and Debugging

### Debug Mode
```bash
# Enable detailed logging for Statsig
DEBUG_STATSIG=true
DEBUG_ANALYTICS=true
```

### Performance Monitoring
```bash
# Enable performance monitoring
STATSIG_PERFORMANCE_MONITORING=true
ANALYTICS_PERFORMANCE_ALERTS=true
```

## Troubleshooting

### Common Issues

1. **Statsig not initializing**
   - Check `STATSIG_ENABLED=true`
   - Verify `NEXT_PUBLIC_STATSIG_CLIENT_API_KEY` is set
   - Check browser console for errors

2. **Session replay not working**
   - Verify `STATSIG_SESSION_REPLAY_ENABLED=true`
   - Check sample rate (might be too low for testing)
   - Ensure user consent for recording

3. **Performance issues**
   - Reduce `STATSIG_SESSION_REPLAY_SAMPLE_RATE`
   - Increase `ANALYTICS_BATCH_SIZE`
   - Increase `ANALYTICS_FLUSH_INTERVAL`

### Verification Commands

```bash
# Check if variables are loaded
node -e "console.log(process.env.NEXT_PUBLIC_STATSIG_CLIENT_API_KEY)"

# Validate configuration
npm run test:statsig-config
```

## Integration Examples

### Basic Event Tracking
```javascript
import { useStatsigEvent } from '@/context/StatsigContext';

const logEvent = useStatsigEvent();

// Track custom event
logEvent('add_to_cart', 'SKU_12345', {
  price: '9.99',
  item_name: 'diet_coke_48_pack',
});
```

### Feature Gates
```javascript
import { useStatsigGate } from '@/context/StatsigContext';

const isFeatureEnabled = useStatsigGate('new_checkout_flow', false);
```

### User Identification
```javascript
import { useStatsig } from '@/context/StatsigContext';

const { updateUser } = useStatsig();

updateUser({
  userID: 'user-123',
  email: 'user@example.com',
  plan: 'premium'
});
```

## Support

For issues with Statsig configuration:

1. Check the [Statsig Documentation](https://docs.statsig.com)
2. Verify environment variables are properly set
3. Check browser console for initialization errors
4. Review performance metrics in the application

For performance issues, refer to the performance monitoring section in the main documentation.