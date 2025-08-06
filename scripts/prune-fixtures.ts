#!/usr/bin/env npx tsx

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIXTURES_DIR = path.join(__dirname, "../src/api/data/fixtures/data");

// Core test slugs that are explicitly tested
const CORE_TEST_SLUGS = new Set([
  "event-horizon-1997",
  "hellraiser-1987",
  "horror-express-1972",
  "night-train-to-terror-1985",
  "rio-bravo-1959",
  "the-curse-of-frankenstein-1957",
]);

// Cast and crew members tested
const TEST_CAST_AND_CREW = new Set([
  "burt-reynolds",
  "christopher-lee",
  "john-wayne",
]);

// Collections tested
const TEST_COLLECTIONS = new Set([
  "friday-the-13th",
  "hatchet",
  "james-bond",
  "shaw-brothers", // Used in Collection component test
]);

// Additional slugs for edge cases (one per grade, decade spread, etc.)
const EDGE_CASE_SLUGS = new Set([
  // Title sorting edge cases
  "3-from-hell-2019", // Starts with number
  "a-walk-among-the-tombstones-2014", // Grade F

  "apostle-2018", // 2010s
  // 5+ viewings
  "avengers-infinity-war-2018", // Has 6 viewings
  // Decade spread with actual slugs
  "bad-seed-1934", // 1930s, has originalTitle, single viewing
  "crisis-1946", // 1940s, has originalTitle
  // Various other grades and decades
  "frankenstein-1931", // Has moreCastAndCrew

  "harold-and-kumar-go-to-white-castle-2004", // 2000s

  // Grade variety (using actual slugs from fixture)
  "heat-1995", // Grade A+

  "pilgrimage-1933", // Has moreCastAndCrew
  "torso-1973", // 1970s, has originalTitle
]);

// Year stats test years
const TEST_YEAR_STATS = new Set(["2012", "2022", "2023"]);

type ReviewedTitle = {
  imdbId: string;
  moreCastAndCrew: {
    slug: string;
    titles: { slug: string }[];
  }[];
  moreCollections: {
    slug: string;
    titles: { slug: string }[];
  }[];
  moreReviews: { slug: string }[];
  slug: string;
  viewings: { viewingDate: string }[];
};

type Viewing = {
  slug: string;
  viewingDate: string;
};

async function pruneFixtures() {
  console.log("Loading fixture files...");

  // Load all fixture files
  const reviewedTitles: ReviewedTitle[] = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "reviewed-titles.json"), "utf8"),
  );

  const viewings: Viewing[] = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "viewings.json"), "utf8"),
  );

  const watchlistTitles = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "watchlist-titles.json"), "utf8"),
  );

  const overrated = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "overrated.json"), "utf8"),
  );

  const underrated = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "underrated.json"), "utf8"),
  );

  const underseen = JSON.parse(
    fs.readFileSync(path.join(FIXTURES_DIR, "underseen.json"), "utf8"),
  );

  console.log(`Original reviewed titles: ${reviewedTitles.length}`);
  console.log(`Original viewings: ${viewings.length}`);

  // Combine all required slugs
  const requiredSlugs = new Set([...CORE_TEST_SLUGS, ...EDGE_CASE_SLUGS]);

  // Track all referenced slugs for foreign key integrity
  const referencedSlugs = new Set<string>(requiredSlugs);
  const referencedCastAndCrew = new Set<string>(TEST_CAST_AND_CREW);
  const referencedCollections = new Set<string>(TEST_COLLECTIONS);

  // First pass: collect all referenced slugs from required reviews
  const requiredReviews = reviewedTitles.filter((r) =>
    requiredSlugs.has(r.slug),
  );

  for (const review of requiredReviews) {
    // Add slugs from moreCastAndCrew
    for (const person of review.moreCastAndCrew || []) {
      referencedCastAndCrew.add(person.slug);
      for (const title of person.titles || []) {
        referencedSlugs.add(title.slug);
      }
    }

    // Add slugs from moreCollections
    for (const collection of review.moreCollections || []) {
      referencedCollections.add(collection.slug);
      for (const title of collection.titles || []) {
        referencedSlugs.add(title.slug);
      }
    }

    // Add slugs from moreReviews
    for (const moreReview of review.moreReviews || []) {
      referencedSlugs.add(moreReview.slug);
    }
  }

  // Add reviews referenced by test cast/crew and collections
  for (const review of reviewedTitles) {
    const hasCastAndCrew = review.moreCastAndCrew?.some((p) =>
      TEST_CAST_AND_CREW.has(p.slug),
    );
    const hasCollection = review.moreCollections?.some((c) =>
      TEST_COLLECTIONS.has(c.slug),
    );

    if (hasCastAndCrew || hasCollection) {
      referencedSlugs.add(review.slug);
    }
  }

  console.log(`Total required review slugs: ${referencedSlugs.size}`);

  // Filter reviewed titles
  const prunedReviewedTitles = reviewedTitles.filter((r) =>
    referencedSlugs.has(r.slug),
  );

  // Filter viewings - only keep viewings for reviews we're keeping
  const prunedViewings = viewings.filter((v) => referencedSlugs.has(v.slug));

  // For watchlist, overrated, underrated, underseen - keep a reasonable subset
  // Keep any that are in our required set, plus some extras for testing
  const prunedWatchlist = watchlistTitles.slice(0, 100);
  const prunedOverrated = overrated
    .filter((item: any) => referencedSlugs.has(item.slug))
    .concat(overrated.slice(0, 20));

  const prunedUnderrated = underrated
    .filter((item: any) => referencedSlugs.has(item.slug))
    .concat(underrated.slice(0, 20));

  const prunedUnderseen = underseen
    .filter((item: any) => referencedSlugs.has(item.slug))
    .concat(underseen.slice(0, 20));

  // Remove duplicates
  const uniqueOverrated = [
    ...new Map(prunedOverrated.map((item: any) => [item.slug, item])).values(),
  ];
  const uniqueUnderrated = [
    ...new Map(prunedUnderrated.map((item: any) => [item.slug, item])).values(),
  ];
  const uniqueUnderseen = [
    ...new Map(prunedUnderseen.map((item: any) => [item.slug, item])).values(),
  ];

  // Write pruned files
  console.log("\nWriting pruned fixtures...");

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "reviewed-titles.json"),
    JSON.stringify(prunedReviewedTitles, null, 2),
  );
  console.log(`Pruned reviewed titles: ${prunedReviewedTitles.length}`);

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "viewings.json"),
    JSON.stringify(prunedViewings, null, 2),
  );
  console.log(`Pruned viewings: ${prunedViewings.length}`);

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "watchlist-titles.json"),
    JSON.stringify(prunedWatchlist, null, 2),
  );
  console.log(`Pruned watchlist: ${prunedWatchlist.length}`);

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "overrated.json"),
    JSON.stringify(uniqueOverrated, null, 2),
  );
  console.log(`Pruned overrated: ${uniqueOverrated.length}`);

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "underrated.json"),
    JSON.stringify(uniqueUnderrated, null, 2),
  );
  console.log(`Pruned underrated: ${uniqueUnderrated.length}`);

  fs.writeFileSync(
    path.join(FIXTURES_DIR, "underseen.json"),
    JSON.stringify(uniqueUnderseen, null, 2),
  );
  console.log(`Pruned underseen: ${uniqueUnderseen.length}`);

  // Cast and crew - remove unreferenced files
  const castAndCrewDir = path.join(FIXTURES_DIR, "cast-and-crew");
  const castAndCrewFiles = fs.readdirSync(castAndCrewDir);

  let keptCastAndCrew = 0;
  for (const file of castAndCrewFiles) {
    const slug = file.replace(".json", "");
    if (referencedCastAndCrew.has(slug)) {
      keptCastAndCrew++;
    } else {
      fs.unlinkSync(path.join(castAndCrewDir, file));
    }
  }
  console.log(
    `Pruned cast and crew files: kept ${keptCastAndCrew}, removed ${castAndCrewFiles.length - keptCastAndCrew}`,
  );

  // Collections - remove unreferenced files
  const collectionsDir = path.join(FIXTURES_DIR, "collections");
  const collectionFiles = fs.readdirSync(collectionsDir);

  let keptCollections = 0;
  for (const file of collectionFiles) {
    const slug = file.replace(".json", "");
    if (referencedCollections.has(slug)) {
      keptCollections++;
    } else {
      fs.unlinkSync(path.join(collectionsDir, file));
    }
  }
  console.log(
    `Pruned collection files: kept ${keptCollections}, removed ${collectionFiles.length - keptCollections}`,
  );

  // Year stats - remove unreferenced files
  const yearStatsDir = path.join(FIXTURES_DIR, "year-stats");
  const yearStatsFiles = fs.readdirSync(yearStatsDir);

  let keptYearStats = 0;
  for (const file of yearStatsFiles) {
    const year = file.replace(".json", "");
    if (TEST_YEAR_STATS.has(year)) {
      keptYearStats++;
    } else {
      fs.unlinkSync(path.join(yearStatsDir, file));
    }
  }
  console.log(
    `Pruned year stats files: kept ${keptYearStats}, removed ${yearStatsFiles.length - keptYearStats}`,
  );

  console.log("\n✅ Fixture pruning complete!");
  console.log(
    `Reduced reviewed-titles from ${reviewedTitles.length} to ${prunedReviewedTitles.length} (${Math.round((1 - prunedReviewedTitles.length / reviewedTitles.length) * 100)}% reduction)`,
  );
}

pruneFixtures().catch(console.error);
