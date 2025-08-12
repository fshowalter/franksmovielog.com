# Performance Bottleneck Analysis

## 🚨 Critical Discovery: Cast & Crew Files

### The Real Bottleneck
**Cast & Crew JSON files are being read 15,750 times EACH!**

```
castAndCrew.readFile.william-powell.json    | Calls: 15,750 | Total: 133,707ms (2.2 minutes!)
castAndCrew.readFile.william-holden.json    | Calls: 15,750 | Total: 133,707ms 
castAndCrew.readFile.warren-oates.json      | Calls: 15,750 | Total: 133,707ms
... (175 files total)
```

### The Math
- 175 cast/crew JSON files × 15,750 reads each = **2,756,250 file reads!**
- Each file takes ~130ms to read on first access
- Total time wasted: **133.7 seconds per file type** 

### Why is this happening?
The cast & crew data is being loaded:
- 90 times for pages (`allCastAndCrewJson` called 90 times)
- 175 files per call
- No caching at the data layer
- = 15,750 reads per file!

## Build Performance (Build 5)

**Build time: 628.89s (10.5 minutes)** - Our best yet!

### What's Working Well
1. **Reviews caching**: Working perfectly
   - `allReviews` called 1,804 times but only takes 87ms total (cached!)
   - `loadExcerptHtml` called 12,622 times but only takes 8.3s total (cached!)

2. **Markdown caching**: Working well
   - `allReviewsMarkdown` only called once
   - `allViewingsMarkdown` only called once

### What Needs Fixing
1. **Cast & Crew data** - No caching, causing millions of redundant file reads
2. **Collections data** - Called 273 times

## Recommended Solution

Add caching to Cast & Crew data similar to reviews:

```typescript
// In castAndCrew.ts
let cachedCastAndCrewJson: CastAndCrewMemberJson[];
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allCastAndCrew() {
  if (cachedCastAndCrewJson) {
    return cachedCastAndCrewJson;
  }
  
  const data = await allCastAndCrewJson();
  if (ENABLE_CACHE) {
    cachedCastAndCrewJson = data;
  }
  return data;
}
```

## Expected Impact

With Cast & Crew caching:
- Eliminate 2.7 million redundant file reads
- Save ~2 minutes of build time
- **Expected build time: 7-8 minutes** (from current 10.5 minutes)

## Summary of All Optimizations

| Optimization | Status | Impact |
|--------------|--------|---------|
| API-level review caching | ✅ Done | Saves ~5 minutes |
| Excerpt caching | ✅ Done | Saves ~1 minute |
| Most recent reviews caching | ✅ Done | Saves ~30 seconds |
| Cast & Crew caching | ❌ TODO | Could save ~2 minutes |
| Collections caching | ❌ TODO | Could save ~30 seconds |

## Current Performance vs Original

- **Original**: 18 minutes
- **Current**: 10.5 minutes (42% improvement)
- **Potential with Cast & Crew fix**: 7-8 minutes (56-61% improvement)