import { cacheDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import sharp from "sharp";

import { componentToImageBytes } from "~/utils/componentToImage";

const assetsCacheDir = new URL("openGraphImages/", cacheDir);
await fs.mkdir(assetsCacheDir, { recursive: true });

const sourceComponentHash = createHash("md5")
  .update(await fs.readFile(new URL(import.meta.url), "utf8"))
  .digest("hex");

export async function createOpenGraphImageResponse({
  backdropSlug,
  title,
}: {
  backdropSlug: string;
  title: string;
}): Promise<Response> {
  const image = await getOpenGraphImage({
    backdropSlug,
    title,
  });

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}

async function getOpenGraphImage({
  backdropSlug,
  title,
}: {
  backdropSlug: string;
  title: string;
}): Promise<Buffer> {
  const stillBuffer = await fs.readFile(
    `./content/assets/backdrops/${backdropSlug}.png`,
  );

  const stillHash = createHash("md5").update(stillBuffer).digest("hex");

  const cacheProps = {
    sourceComponentHash,
    stillHash,
    title,
  };

  const cacheDigest = createHash("md5")
    .update(JSON.stringify(cacheProps))
    .digest("hex");

  const cacheFilePath = new URL(
    `${backdropSlug}.${cacheDigest}.jpg`,
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

  if (cached) {
    console.log(` (reused cache entry)`);
    return cached;
  }

  console.log(
    ` (cache miss for entry ${JSON.stringify({ ...cacheProps, componentFile: import.meta.url })})`,
  );

  const still = await sharp(stillBuffer).resize(1200).toBuffer();

  const fetchedResources = [
    {
      data: new Uint8Array(still).buffer,
      src: "backdrop",
    },
  ];

  const heroImage = await componentToImageBytes(
    <OpenGraphImage title={title} />,
    fetchedResources,
  );

  await fs.writeFile(cacheFilePath, heroImage);

  return heroImage;
}

function OpenGraphImage({ title }: { title: string }): React.JSX.Element {
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
        src="backdrop"
        style={{
          objectFit: "cover",
        }}
        width={1200}
      />
      <div
        style={{
          backgroundImage:
            "radial-gradient(ellipse at left bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.75) 15%, rgba(0, 0, 0, 0)) 25%",
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          paddingBottom: "64px",
          paddingLeft: "80px",
          paddingRight: "80px",
          paddingTop: "332px",
          position: "absolute",
          width: "1200px",
        }}
      >
        <div
          style={{
            color: "#c29d52",
            fontFamily: "Assistant",
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "8px",
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
            fontSize: "88px",
            fontWeight: 800,
            lineHeight: 1,
            textShadow: "1px 1px 2px black",
            textWrap: "balance",
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}
