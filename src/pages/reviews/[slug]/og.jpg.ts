import fs from "node:fs/promises";
import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import sharp from "sharp";
import { allReviews } from "src/api/reviews";
import { fileForGrade } from "src/components/Grade";
import { getProps } from "src/components/Review/getProps";
import { OpenGraphImage } from "src/components/Review/OpenGraphImage";
import { componentToPng } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { reviews } = await allReviews();

  return reviews.map((review) => {
    return {
      params: {
        slug: review.slug,
      },
      props: {
        slug: review.slug,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { slug } = props as Props;

  const reviewProps = await getProps(slug);

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/stills/${slug}.png`),
  )
    .resize(600)
    .toFormat("png")
    .toBuffer();

  const gradeBuffer = await fs.readFile(
    path.resolve(`./public${fileForGrade(reviewProps.value.grade)}`),
  );

  const jpeg = await componentToPng(
    OpenGraphImage({
      title: reviewProps.value.title,
      year: reviewProps.value.year,
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
      grade: `data:${"image/svg+xml"};base64,${gradeBuffer.toString("base64")}`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
