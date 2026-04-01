import { cacheDir, srcDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { existsSync, promises as fs } from "node:fs";
import sharp from "sharp";

import type { GradeText } from "~/utils/grades";

import { componentToImageBytes } from "~/utils/componentToImage";
import { GRADE_SVG_MAP } from "~/utils/grades";

const reviewOpenGraphImageComponentHash = createHash("md5")
  .update(
    await fs.readFile(
      new URL("features/review/ReviewOpenGraphImage.tsx", srcDir),
      "utf8",
    ),
  )
  .digest("hex")
  .toString();

const gradeCache: Record<
  GradeText,
  undefined | { buffer: Buffer; hash: string }
> = {
  A: undefined,
  "A+": undefined,
  "A-": undefined,
  B: undefined,
  "B+": undefined,
  "B-": undefined,
  C: undefined,
  "C+": undefined,
  "C-": undefined,
  D: undefined,
  "D+": undefined,
  "D-": undefined,
  F: undefined,
  "F+": undefined,
  "F-": undefined,
};

export async function getReviewOpenGraphImage({
  component,
  grade,
  releaseYear,
  stillSlug,
  title,
}: {
  component: React.ReactNode;
  grade: GradeText;
  releaseYear: string;
  stillSlug: string;
  title: string;
}) {
  const stillBuffer = await fs.readFile(
    `./content/assets/stills/${stillSlug}.png`,
  );

  const stillHash = createHash("md5")
    .update(stillBuffer)
    .digest("hex")
    .toString();

  let gradeHash: string;
  let gradeBuffer: Buffer;

  const gradeCacheEntry = gradeCache[grade];

  if (gradeCacheEntry) {
    gradeHash = gradeCacheEntry.hash;
    gradeBuffer = gradeCacheEntry.buffer;
  } else {
    const { src: gradeFile } = GRADE_SVG_MAP[grade];
    gradeBuffer = await fs.readFile(`./public${gradeFile}`);

    gradeHash = createHash("md5").update(gradeBuffer).digest("hex").toString();

    gradeCache[grade] = { buffer: gradeBuffer, hash: gradeHash };
  }

  const cacheProps = JSON.stringify({
    gradeHash,
    releaseYear,
    reviewOpenGraphImageComponentHash,
    stillHash,
    title,
  });

  const cacheDigest = createHash("md5")
    .update(cacheProps)
    .digest("hex")
    .toString();

  const assetsCacheDir = new URL("reviewOpenGraphImages/", cacheDir);
  await fs.mkdir(assetsCacheDir, { recursive: true });

  const cacheFilePath = new URL(
    `${stillSlug}.${cacheDigest}.png`,
    assetsCacheDir,
  );

  if (existsSync(cacheFilePath)) {
    return await fs.readFile(cacheFilePath);
  }

  const still = await sharp(stillBuffer).resize(1200).toBuffer();

  const fetchedResources = [
    {
      data: new Uint8Array(still).buffer,
      src: "still",
    },
    {
      data: new Uint8Array(gradeBuffer).buffer,
      src: "grade",
    },
  ];

  const heroImage = await componentToImageBytes(component, fetchedResources);

  await fs.writeFile(cacheFilePath, heroImage);

  return heroImage;
}
