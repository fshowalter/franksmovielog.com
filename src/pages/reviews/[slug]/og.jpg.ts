import type { APIRoute, InferGetStaticPropsType } from "astro";

import path from "node:path";
import sharp from "sharp";
import { allReviews } from "src/api/reviews";
import { fileForGrade } from "src/components/Grade";
import { OpenGraphImage } from "src/components/Review/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { reviews } = await allReviews();

  return reviews.map((review) => {
    return {
      params: {
        slug: review.slug,
      },
      props: {
        grade: review.grade,
        slug: review.slug,
        title: review.title,
        year: review.year,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { grade, slug, title, year } = props as Props;

  const imageBuffer = await sharp(
    path.resolve(`./content/assets/stills/${slug}.png`),
  )
    .resize(1200)
    .toFormat("png")
    .toBuffer();

  const gradeBuffer = await sharp(
    path.resolve(`./public${fileForGrade(grade)}`),
  )
    .resize(240)
    .toFormat("png")
    .toBuffer();

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
      grade: `data:${"image/png"};base64,${gradeBuffer.toString("base64")}`,
      title,
      year,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
