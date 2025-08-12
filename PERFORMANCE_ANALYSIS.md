# Performance Analysis Report

## Build Performance Summary
- **Total Build Time**: ~15 minutes (905 seconds)
- **Total Operations Measured**: 44,383
- **Key Bottleneck**: Repeated data loading and parsing

## Critical Findings

### 1. Massive Redundant JSON Parsing
- `allReviewedTitlesJson()` called **1,805 times** during build
- Each call reads and parses a ~3MB JSON file
- Total redundant work: **5.4GB** of JSON parsing
- Time wasted: ~1,800 seconds cumulative (multiple instances running in parallel)

### 2. Repeated Markdown Parsing
- 2,914 viewing markdown files parsed multiple times
- 1,801 review markdown files parsed multiple times
- Total individual file parse operations: 4,715

### 3. Top Time Consumers
1. **reviews.initCache**: 2,497ms (initial load)
2. **allViewingsMarkdown**: 1,287ms per call
3. **viewingsMarkdown.parseAll**: 1,144ms (2,914 files)
4. **loadContent**: 800-1,100ms per call (called 1,801 times)
5. **allReviewedTitlesJson**: 700-1,100ms per call (called 1,805 times)

## Root Causes

### Issue 1: No In-Memory Caching in Build Mode
The code only caches when `import.meta.env.MODE !== "development"`, but during build:
- Each page is built in isolation
- No shared memory between page builds
- Every page re-reads and re-parses ALL data

### Issue 2: Inefficient Data Access Pattern
For each review page:
1. Loads ALL reviewed titles JSON (1,801 entries)
2. Loads ALL viewings markdown (2,914 files)
3. Loads ALL reviews markdown (1,801 files)
4. Only uses data for ONE review

## Recommended Solution

### Phase 1: Immediate Fix - In-Memory Caching
1. **Enable caching during build**: Remove the `import.meta.env.MODE !== "development"` check
2. **Use module-level caching**: Cache at module load time, not function call time
3. **Estimated improvement**: 80-90% reduction in build time

### Phase 2: Optimize Data Loading
1. **Lazy loading**: Only load data when needed
2. **Granular access**: Create individual JSON files per review instead of one giant file
3. **Indexed lookups**: Use maps/indexes instead of array searches

### Phase 3: Build-Time Data Preparation
1. **Pre-process markdown**: Convert markdown to HTML during data generation
2. **Pre-compute relationships**: Build viewing/review relationships ahead of time
3. **Static data files**: Generate static JSON per page with only needed data

## Expected Impact

### With Phase 1 (In-Memory Caching):
- Reduce redundant JSON parsing from 1,805 to 1
- Reduce redundant markdown parsing from multiple to 1
- **Expected build time: 3-5 minutes** (vs current 15 minutes)

### With Phase 2 & 3:
- Near-zero redundant work
- **Expected build time: 1-2 minutes**

## Implementation Priority

1. **URGENT**: Fix in-memory caching (1 hour effort, massive impact)
2. **HIGH**: Split large JSON files (2-3 hours effort, good impact)  
3. **MEDIUM**: Pre-process markdown (4-6 hours effort, moderate impact)

## Comparison with PR 2291 Approach

The disk caching in PR 2291 attempted to solve this but:
- Added complexity with disk I/O
- Still parsed files on every dev server request
- Only saved ~2 minutes in CI

The real issue is **repeated parsing**, not file I/O. In-memory caching solves this more effectively.