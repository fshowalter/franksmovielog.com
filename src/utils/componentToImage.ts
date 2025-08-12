import type { JSX } from "react";

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";

import { serializeJsx } from "./serializeJsx";

// Cache directory for generated images
const CACHE_DIR = import.meta.env.MODE === "test" 
  ? path.join(tmpdir(), "og-images-test-cache")
  : path.join(process.cwd(), ".cache", "og-images");

// Enable caching during builds but not in dev mode
const ENABLE_CACHE = !import.meta.env.DEV;


// Initialize cache directory
async function ensureCacheDir() {
  await fs.mkdir(CACHE_DIR, { recursive: true });
}


// Get cache file path
function getCachePath(cacheKey: string): string {
  // Use first 2 chars as subdirectory to avoid too many files in one directory
  const subDir = cacheKey.substring(0, 2);
  return path.join(CACHE_DIR, subDir, `${cacheKey}.jpg`);
}

// Check if cached image exists
async function getCachedImage(cacheKey: string): Promise<Uint8Array<ArrayBuffer> | null> {
  const cachePath = getCachePath(cacheKey);
  
  try {
    const buffer = await fs.readFile(cachePath);
    return buffer as Uint8Array<ArrayBuffer>;
  } catch (error) {
    // Cache miss
    return null;
  }
}

// Save image to cache
async function saveCachedImage(cacheKey: string, imageBuffer: Uint8Array<ArrayBuffer>): Promise<void> {
  const cachePath = getCachePath(cacheKey);
  const cacheSubDir = path.dirname(cachePath);
  
  await fs.mkdir(cacheSubDir, { recursive: true });
  await fs.writeFile(cachePath, imageBuffer);
}

// Font data cache to avoid reading fonts multiple times
let fontDataCache: Array<{ data: ArrayBuffer; name: string; weight: number }> | null = null;

async function getFontData() {
  if (fontDataCache) {
    return fontDataCache;
  }
  
  fontDataCache = [
    {
      data: await fs.readFile(
        "./public/fonts/Frank-Ruhl-Libre/Frank-Ruhl-Libre-Regular.ttf",
      ),
      name: "FrankRuhlLibre",
      weight: 400,
    },
    {
      data: await fs.readFile(
        "./public/fonts/ArgentumSans/ArgentumSans-Regular.ttf",
      ),
      name: "ArgentumSans",
      weight: 400,
    },
    {
      data: await fs.readFile(
        "./public/fonts/ArgentumSans/ArgentumSans-SemiBold.ttf",
      ),
      name: "ArgentumSans",
      weight: 600,
    },
  ];
  
  return fontDataCache;
}

export async function componentToImage(component: JSX.Element): Promise<Uint8Array<ArrayBuffer>> {
  if (ENABLE_CACHE) {
    await ensureCacheDir();
    
    // Serialize the component to create a stable cache key
    const serialized = serializeJsx(component);
    const cacheKey = createHash("sha256").update(serialized).digest("hex");
    
    // Check for cached image
    const cachedImage = await getCachedImage(cacheKey);
    if (cachedImage) {
      if (process.env.DEBUG_CACHE === "true") {
        console.log(`[CACHE HIT] OG Image: ${cacheKey.substring(0, 8)}...`);
      }
      return cachedImage;
    }
    
    if (process.env.DEBUG_CACHE === "true") {
      console.log(`[CACHE MISS] OG Image: ${cacheKey.substring(0, 8)}...`);
      if (process.env.DEBUG_CACHE_VERBOSE === "true") {
        console.log(`[CACHE] Serialized length: ${serialized.length}`);
        console.log(`[CACHE] Serialized preview: ${serialized.substring(0, 200)}...`);
      }
    }
    
    // Generate the SVG (expensive operation)
    const svg = await componentToSvg(component);
    
    // Convert SVG to JPEG
    const imageBuffer = await sharp(Buffer.from(svg))
      .jpeg()
      .toBuffer() as Uint8Array<ArrayBuffer>;
    
    // Save to cache
    await saveCachedImage(cacheKey, imageBuffer);
    
    return imageBuffer;
  }
  
  // No caching - generate SVG and convert to JPEG
  const svg = await componentToSvg(component);
  return await sharp(Buffer.from(svg))
    .jpeg()
    .toBuffer() as Uint8Array<ArrayBuffer>;
}

async function generateImage(component: JSX.Element): Promise<Uint8Array<ArrayBuffer>> {
  const svg = await componentToSvg(component);
  return (await sharp(Buffer.from(svg))
    .jpeg()
    .toBuffer()) as Uint8Array<ArrayBuffer>;
}

async function componentToSvg(component: JSX.Element) {
  const fonts = await getFontData();
  
  return await satori(component, {
    fonts,
    height: 630,
    width: 1200,
  });
}