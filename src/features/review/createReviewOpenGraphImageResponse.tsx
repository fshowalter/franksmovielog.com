import { cacheDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

import type { GradeText } from "~/utils/grades";

import { componentToImageBytes } from "~/utils/componentToImage";
import { GRADE_SVG_MAP } from "~/utils/grades";

const assetsCacheDir = new URL("reviewOpenGraphImages/", cacheDir);
await fs.mkdir(assetsCacheDir, { recursive: true });

const sourceComponentHash = createHash("md5")
  .update(await fs.readFile(new URL(import.meta.url), "utf8"))
  .digest("hex");

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

type Props = {
  grade: GradeText;
  releaseYear: string;
  stillSlug: string;
  title: string;
};

export async function createReviewOpenGraphImageResponse({
  grade,
  releaseYear,
  stillSlug,
  title,
}: Props): Promise<Response> {
  const image = await getReviewOpenGraphImage({
    component: <ReviewOpenGraphImage releaseYear={releaseYear} title={title} />,
    grade,
    releaseYear,
    stillSlug,
    title,
  });

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
}

async function getReviewOpenGraphImage({
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
}): Promise<Buffer> {
  const stillBuffer = await fs.readFile(
    `./content/assets/stills/${stillSlug}.png`,
  );

  const stillHash = createHash("md5").update(stillBuffer).digest("hex");

  let gradeHash: string;
  let gradeBuffer: Buffer;

  const gradeCacheEntry = gradeCache[grade];

  if (gradeCacheEntry) {
    gradeHash = gradeCacheEntry.hash;
    gradeBuffer = gradeCacheEntry.buffer;
  } else {
    const { src: gradeFile } = GRADE_SVG_MAP[grade];

    gradeBuffer = await sharp(path.resolve(`./public${gradeFile}`))
      .resize(240)
      .toBuffer();

    gradeHash = createHash("md5").update(gradeBuffer).digest("hex");

    gradeCache[grade] = { buffer: gradeBuffer, hash: gradeHash };
  }

  const cacheProps = JSON.stringify({
    gradeHash,
    releaseYear,
    sourceComponentHash,
    stillHash,
    title,
  });

  const cacheDigest = createHash("md5").update(cacheProps).digest("hex");

  const cacheFilePath = new URL(
    `${stillSlug}.${cacheDigest}.jpg`,
    assetsCacheDir,
  );

  const cached = await fs
    .readFile(cacheFilePath)
    .catch((error: Error & { code: unknown }) => {
      if (error.code !== "ENOENT") {
        throw new Error(
          `An error was encountered while reading the cache file. Error: ${error}`,
        );
      }
    });

  if (cached) return cached;

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

function ReviewOpenGraphImage({
  releaseYear,
  title,
}: {
  releaseYear: string;
  title: string;
}): React.JSX.Element {
  "use no memo";

  return (
    <div
      style={{
        display: "flex",
        height: "630px",
        position: "relative",
        width: "1200px",
      }}
    >
      <img
        height={630}
        src="still"
        style={{
          objectFit: "cover",
        }}
        width={600}
      />
      <div
        style={{
          backgroundColor: "#252525",
          display: "flex",
          flexDirection: "column",
          height: "630px",
          justifyContent: "center",
          paddingBottom: "32px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "32px",
          width: "600px",
        }}
      >
        <div
          style={{
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "16px",
            textTransform: "uppercase",
          }}
        >
          Frank&apos;s Movie Log
        </div>
        <div
          style={{
            color: "#fff",
            display: "flex",
            flexWrap: "wrap",
            fontFamily: "FrankRuhlLibre",
            fontSize: "54px",
            fontWeight: 600,
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {title} ({releaseYear})
        </div>

        <img
          height={48}
          src="grade"
          style={{ marginTop: "36px" }}
          width={240}
        />
      </div>
    </div>
  );
}
