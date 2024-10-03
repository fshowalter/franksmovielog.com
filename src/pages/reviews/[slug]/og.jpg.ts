import path from "node:path";

import type { APIRoute, InferGetStaticPropsType } from "astro";
import image2uri from "image2uri";
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

  const grade = await image2uri(
    path.resolve(`./public${fileForGrade(reviewProps.value.grade)}`),
  );

  console.log(grade);

  const png = await componentToPng(
    OpenGraphImage({
      title: reviewProps.value.title,
      year: reviewProps.value.year,
      backdrop: `data:${"image/png"};base64,${imageBuffer.toString("base64")}`,
      grade: grade,
    }),
  );

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
