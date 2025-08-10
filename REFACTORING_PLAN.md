# Refactoring Plan - Build Time Improvements

## Overview

The goal of this refactor is to improve the execution times of the build-and-deploy action by implementing a custom content-based caching solution.

Source here: /.github/workflows/build-and-deploy.yml
Historic performance here: https://github.com/fshowalter/franksmovielog.com/actions/workflows/build-and-deploy.yml

### Guardrails

- We must preserve our existing type safety, including our existing nuance around undefined vs optional.
- Caching must work in all environments (dev, prod, test)
- Test fixtures must remain separate and functional

### Definition of Success

- The change will be successful if we can reduce build-and-deploy execution time through incremental builds that avoid re-parsing unchanged content files.

## Custom Caching Solution

### Why Custom Cache?

**Initial Attempt - Astro Content Collections:**
- Content Collections are fundamentally incompatible with testing frameworks
- They require either a dev server with HMR or a full build process to generate the virtual module `astro:data-layer-content`
- This module doesn't exist in test environments, making it impossible to test components that rely on Content Collections

**Solution - Custom Content-Based Cache:**
- Implement our own content-based caching on top of the existing file system implementation
- Use the same strategy as Astro's cache but with full control
- Works identically in dev, prod, and test environments

### Cache Design

**Architecture:**
- Add persistent disk cache layer on top of existing file system code
- Keep all schemas in `src/api/data/` (our source of truth)
- Cache works identically in dev, prod, and test environments

**Implementation Details:**
- Use **xxhash-wasm** for content digests (same as Astro)
- Use **devalue** for serialization (handles Dates, undefined, etc.)
- Store cache in `.cache/content-cache.json` (persists between builds)
- Test mode uses separate cache directory to avoid conflicts

**Cache Structure:**
```json
{
  "schemaVersion": "hash-of-all-schemas",
  "entries": {
    "[filePath]": {
      "digest": "xxhash-of-file-content",
      "data": { /* parsed data */ },
      "timestamp": 1234567890
    }
  }
}
```

### Cache Invalidation Logic

1. **Schema changes**: Hash all schemas → if different, invalidate entire cache
2. **File changes**: Hash file content → if digest differs from cached, invalidate entry
3. **Missing cache**: First build creates cache, subsequent builds reuse

### Implementation Flow

```
1. Check if cache exists and schema version matches
2. For each file:
   - Read file content
   - Generate xxhash digest
   - If digest matches cached: return cached data
   - If digest differs: parse file, update cache
3. Write updated cache to disk
```

### Test Mode

- Uses separate cache directory: `.cache-test-${process.pid}-${Date.now()}`
- Prevents race conditions between parallel test runs
- Automatically cleaned up after tests complete
- Uses fixture paths from `src/api/data/fixtures/`

### Expected Benefits

1. **Performance**: Avoid re-parsing unchanged files between builds (faster incremental builds)
2. **Compatibility**: Works in ALL environments (dev, prod, test)
3. **Control**: Full control over caching logic
4. **Testability**: Cache works with test fixtures

## Implementation Status

### Phase 1: Cache Utilities (In Progress)

- [ ] Install xxhash-wasm and devalue dependencies
- [ ] Create cache utilities in `src/api/data/utils/cache.ts`
- [ ] Add cache to `.gitignore`

### Phase 2: Integrate with Data Loading

- [ ] Update `reviewsMarkdown.ts` to use cache
- [ ] Update other markdown loaders to use cache
- [ ] Update JSON loaders to use cache

### Phase 3: Testing & Optimization

- [ ] Ensure cache works with test fixtures
- [ ] Update `.github/workflows/build-and-deploy.yml` to cache `.cache` directory
- [ ] Measure performance improvements vs baseline

## Key Files

- `/src/api/data/utils/cache.ts` - Core cache implementation
- `/src/api/data/utils/getContentPath.ts` - Path resolution for fixtures vs production
- `/setupTests.ts` - Mock setup for test fixtures