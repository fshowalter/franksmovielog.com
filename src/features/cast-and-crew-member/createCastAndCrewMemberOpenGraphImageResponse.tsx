import { cacheDir } from "astro:config/server";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import sharp from "sharp";

import { componentToImageBytes } from "~/utils/componentToImage";

const assetsCacheDir = new URL("castAndCrewMemberOpenGraphImages/", cacheDir);
await fs.mkdir(assetsCacheDir, { recursive: true });

const sourceComponentHash = createHash("md5")
  .update(
    await fs.readFile(
      `./src/features/cast-and-crew-member/createCastAndCrewMemberOpenGraphImageResponse.tsx`,
      "utf8",
    ),
  )
  .digest("hex");

type Props = {
  name: string;
  portraitSlug: string;
};

export async function createCastAndCrewMemberOpenGraphImageResponse({
  name,
  portraitSlug,
}: Props): Promise<Response> {
  const image = await getCastAndCrewMemberOpenGraphImage({
    name,
    portraitSlug,
  });

  return new Response(image as ArrayBufferView<ArrayBuffer>, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  });
}

function CastAndCrewMemberOpenGraphImage({
  name,
}: {
  name: string;
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
        src="portrait"
        style={{
          objectFit: "cover",
        }}
        width={630}
      />
      <div
        style={{
          backgroundColor: "#252525",
          display: "flex",
          flexDirection: "column",
          height: "630px",
          justifyContent: "center",
          paddingBottom: "32px",
          paddingLeft: "60px",
          paddingRight: "60px",
          paddingTop: "32px",
          width: "570px",
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
            fontSize: "68px",
            fontWeight: 600,
            lineHeight: 1,
            textWrap: "balance",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

async function getCastAndCrewMemberOpenGraphImage({
  name,
  portraitSlug,
}: {
  name: string;
  portraitSlug: string;
}): Promise<Buffer> {
  const portraitBuffer = await fs.readFile(
    `./content/assets/portraits/${portraitSlug}.png`,
  );

  const portraitHash = createHash("md5").update(portraitBuffer).digest("hex");

  const cacheProps = JSON.stringify({
    name,
    portraitHash,
    sourceComponentHash,
  });

  const cacheDigest = createHash("md5").update(cacheProps).digest("hex");

  const cacheFilePath = new URL(
    `${portraitHash}.${cacheDigest}.jpg`,
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
    return cached;
  }

  const still = await sharp(portraitBuffer).resize(1200).toBuffer();

  const fetchedResources = [
    {
      data: new Uint8Array(still).buffer,
      src: "portrait",
    },
  ];

  const heroImage = await componentToImageBytes(
    <CastAndCrewMemberOpenGraphImage name={name} />,
    fetchedResources,
  );

  await fs.writeFile(cacheFilePath, heroImage);

  return heroImage;
}
