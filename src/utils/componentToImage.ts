import type { JSX, ReactElement } from "react";
import type { Font } from "satori";

import fs from "node:fs/promises";
import satori from "satori";
import sharp from "sharp";

import type { HomeOpenGraphImageComponentType } from "~/components/Home/OpenGraphImage";
import type { OpenGraphImageComponentType } from "~/components/OpenGraphImage";
import type { ReviewOpenGraphImageComponentType } from "~/components/Review/OpenGraphImage";

import {
  createCacheConfig,
  createCacheKey,
  ensureCacheDir,
  getCachedItem,
  saveCachedItem,
} from "./cache";

const cacheConfig = createCacheConfig("og-images");

// Font data cache to avoid reading fonts multiple times
let fontDataCache: Font[] | undefined;

type OpenGraphImageComponent =
  | HomeOpenGraphImageComponentType
  | OpenGraphImageComponentType
  | ReviewOpenGraphImageComponentType;

type ReactElementWithType = ReactElement & {
  $$typeof?: symbol;
  props: {
    [key: string]: unknown;
    children?: unknown;
  };
  type: string;
};

export async function componentToImage(
  component: ReturnType<OpenGraphImageComponent>,
): Promise<Uint8Array<ArrayBuffer>> {
  // If caching is disabled, generate and return image directly
  if (!cacheConfig.enableCache) {
    const svg = await componentToSvg(component);
    return (await sharp(Buffer.from(svg))
      .jpeg()
      .toBuffer()) as Uint8Array<ArrayBuffer>;
  }

  await ensureCacheDir(cacheConfig.cacheDir);

  // Serialize the component to create a stable cache key
  const serialized = serializeJsx(component);
  const cacheKey = createCacheKey(serialized);

  // Check for cached image
  const cachedImage = await getCachedItem<Uint8Array<ArrayBuffer>>(
    cacheConfig.cacheDir,
    cacheKey,
    "jpg",
    true,
    cacheConfig.debugCache,
    `OG Image: ${cacheKey.slice(0, 8)}...`,
  );

  if (cachedImage) {
    return cachedImage;
  }

  // Generate the SVG (expensive operation)
  const svg = await componentToSvg(component);

  // Convert SVG to JPEG
  const imageBuffer = (await sharp(Buffer.from(svg))
    .jpeg()
    .toBuffer()) as Uint8Array<ArrayBuffer>;

  // Save to cache
  await saveCachedItem(cacheConfig.cacheDir, cacheKey, "jpg", imageBuffer);

  return imageBuffer;
}

async function componentToSvg(component: ReturnType<OpenGraphImageComponent>) {
  const fonts = await getFontData();

  return await satori(component, {
    fonts,
    height: 630,
    width: 1200,
  });
}

async function getFontData() {
  if (fontDataCache) {
    return fontDataCache;
  }

  const [frankRuhlLibre, argentumSansRegular, argentumSansSemiBold] =
    await Promise.all([
      fs.readFile(
        "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf",
      ),
      fs.readFile("./public/fonts/ArgentumSans/ArgentumSans-Regular.ttf"),
      fs.readFile("./public/fonts/ArgentumSans/ArgentumSans-SemiBold.ttf"),
    ]);

  fontDataCache = [
    {
      data: frankRuhlLibre.buffer as ArrayBuffer,
      name: "FrankRuhlLibre",
      weight: 400,
    },
    {
      data: argentumSansRegular.buffer as ArrayBuffer,
      name: "ArgentumSans",
      weight: 400,
    },
    {
      data: argentumSansSemiBold.buffer as ArrayBuffer,
      name: "ArgentumSans",
      weight: 600,
    },
  ];

  return fontDataCache;
}

/**
 * Serialize a JSX element to a stable string representation for hashing.
 * Simplified for OG image generation use case.
 * AIDEV-NOTE: This function is only used for OG image caching and handles
 * the specific JSX structures used in OG images (HTML elements, strings, arrays).
 */
function serializeJsx(element: JSX.Element): string {
  // Handle primitive values (strings, numbers, booleans)
  if (
    typeof element !== "object" ||
    element === null ||
    element === undefined
  ) {
    return JSON.stringify(element);
  }

  // Handle arrays
  if (Array.isArray(element)) {
    return `[${element.map((item) => serializeJsx(item as JSX.Element)).join(",")}]`;
  }

  // Handle React elements
  const reactElement = element as ReactElementWithType;
  // For OG images, we only use string types (HTML elements)
  const typeName = reactElement.type;

  const props: Record<string, unknown> = {};

  // Process props, excluding children
  const elementProps = reactElement.props as Record<string, unknown>;
  for (const [key, value] of Object.entries(elementProps)) {
    if (key === "children") continue;

    // For OG images, we only have primitives and objects (style objects)
    // For objects and arrays (but not null), serialize as JSON
    props[key] =
      typeof value === "object" && value !== null
        ? JSON.stringify(value)
        : value; // Primitives (including null/undefined)
  }

  // Sort props for deterministic output
  const sortedPropsStr = JSON.stringify(props, Object.keys(props).sort());

  // Serialize children
  const children = reactElement.props?.children;
  const childrenStr = children ? serializeJsx(children as JSX.Element) : "";

  // Combine into a stable string representation
  return `<${typeName}:${sortedPropsStr}>${childrenStr}</${typeName}>`;
}
