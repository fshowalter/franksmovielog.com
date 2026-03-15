import path from "node:path";
import sharp from "sharp";

import { getOpenGraphStill } from "~/assets/stills";
import { fileForGrade } from "~/components/grade/fileForGrade";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

/**
 * Type for review OpenGraph image component.
 */
export type ReviewOpenGraphImageComponentType = (props: {
  releaseYear: string;
  title: string;
}) => React.JSX.Element;

type Props = {
  grade: string;
  releaseYear: string;
  stillSlug: string;
  title: string;
};

export async function reviewOpenGraphImageResponse({
  grade,
  releaseYear,
  stillSlug,
  title,
}: Props): Promise<Response> {
  const still = await getOpenGraphStill(stillSlug);

  let gradeBuffer;

  const gradeFile = fileForGrade(grade);

  if (gradeFile) {
    gradeBuffer = await sharp(path.resolve(`./public${fileForGrade(grade)}`))
      .resize(240)
      .toBuffer();
  }

  const fetchedResources = [
    {
      data: still,
      src: "still",
    },
  ];

  if (gradeBuffer) {
    fetchedResources.push({
      data: new Uint8Array(gradeBuffer).buffer,
      src: "grade",
    });
  }

  return await componentToImageResponse(
    <ReviewOpenGraphImage releaseYear={releaseYear} title={title} />,
    fetchedResources,
  );
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
