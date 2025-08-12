import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import smartypants from "remark-smartypants";
import strip from "strip-markdown";

import {
  allCollectionsJson,
  type CollectionJson,
} from "./data/collectionsJson";
import { perfLogger } from "./data/utils/performanceLogger";
import { emToQuotes } from "./utils/markdown/emToQuotes";
import { rootAsSpan } from "./utils/markdown/rootAsSpan";

export type Collection = CollectionJson & {};

export type CollectionWithDetails = Collection & {
  descriptionHtml: string;
};

// Cache at API level - works better with Astro's build process
let cachedCollectionsJson: CollectionJson[];
let cachedAllCollections: { collections: Collection[] };
const cachedCollectionDetails: Record<string, {
  collection: CollectionWithDetails;
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
}> = {};

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;

export async function allCollections(): Promise<{
  collections: Collection[];
}> {
  return await perfLogger.measure("allCollections", async () => {
    if (cachedAllCollections) {
      return cachedAllCollections;
    }

    const collections = cachedCollectionsJson || await allCollectionsJson();
    if (ENABLE_CACHE) cachedCollectionsJson = collections;

    const result = {
      collections: collections,
    };

    if (ENABLE_CACHE) {
      cachedAllCollections = result;
    }

    return result;
  });
}

export async function collectionDetails(slug: string): Promise<{
  collection: CollectionWithDetails;
  distinctReleaseYears: string[];
  distinctReviewYears: string[];
}> {
  return await perfLogger.measure(`collectionDetails.${slug}`, async () => {
    if (cachedCollectionDetails[slug]) {
      return cachedCollectionDetails[slug];
    }

  const collections = cachedCollectionsJson || await allCollectionsJson();
  if (ENABLE_CACHE) cachedCollectionsJson = collections;
  
  const collection = collections.find((value) => value.slug === slug)!;

  const releaseYears = new Set<string>();
  const reviewYears = new Set<string>();

  for (const title of collection.titles) {
    releaseYears.add(title.releaseYear);

    if (title.reviewDate) {
      reviewYears.add(
        new Date(title.reviewDate).toLocaleDateString("en-US", {
          timeZone: "UTC",
          year: "numeric",
        }),
      );
    }
  }

  const result = {
    collection: {
      ...collection,
      description: descriptionToString(collection.description),
      descriptionHtml: descriptionToHtml(collection.description),
    },
    distinctReleaseYears: [...releaseYears].toSorted(),
    distinctReviewYears: [...reviewYears].toSorted(),
  };

  // Cache the result
  if (ENABLE_CACHE) {
    cachedCollectionDetails[slug] = result;
  }

  return result;
  });
}

function descriptionToHtml(description: string) {
  return getMastProcessor()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rootAsSpan)
    .use(rehypeStringify)
    .processSync(description)
    .toString();
}

function descriptionToString(description: string) {
  return getMastProcessor()
    .use(emToQuotes)
    .use(strip)
    .processSync(description)
    .toString();
}

function getMastProcessor() {
  return remark().use(remarkGfm).use(smartypants);
}
