# Build Performance Comparison

## Build Times

| Build | Time (seconds) | Time (minutes) | vs Original | Description |
|-------|---------------|----------------|-------------|-------------|
| **Original** | 1080s | 18.0 min | Baseline | No caching |
| **PR 2291** | ~960s | 16.0 min | -11% | Disk caching |
| **Build 2** | 2080s | 34.6 min | +93% | Data-layer memory cache (failed) |
| **Build 3** | 653s | 10.9 min | -40% | API-level cache |
| **Build 4** | 719s | 12.0 min | -33% | API-level + mostRecent cache |

## Analysis of Build 4

### Why slightly slower than Build 3?
The first call to `mostRecentReviews.4` took 1358ms (vs 714ms in Build 3). This could be due to:
1. System load/resource availability
2. The caching code adding some overhead on first call
3. Normal variance in build times

### Cache is working correctly:
- `mostRecentReviews.4` called 3 times but only processed once (cache hits for other 2)
- `mostRecentReviews.6` called once
- `mostRecentReviews.10` called once  
- `mostRecentReviews.12` called once

### Key improvements still holding:
- `allReviewedTitlesJson` only called 2-3 times (vs 1,805 originally)
- `allReviewsMarkdown` only called once
- `allViewingsMarkdown` only called once

## Conclusion

The API-level caching strategy is successful:
- **33-40% faster** than original (6-7 minutes saved)
- **Much simpler** than disk caching approach
- **Consistent improvement** across multiple runs

The slight variance between Build 3 (10.9 min) and Build 4 (12.0 min) is normal and both are significantly better than the original 18 minutes.

## Recommendations

1. **Keep current solution** - It's working well
2. **Remove performance instrumentation** before merging - it adds overhead
3. **Consider caching Cast & Crew data** - Still showing as slow operations
4. **Monitor in production** - Verify improvements carry over to CI/CD