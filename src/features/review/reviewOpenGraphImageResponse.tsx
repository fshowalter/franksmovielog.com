import type { GradeText } from "~/utils/grades";

import { getReviewOpenGraphImage } from "~/assets/reviewOpenGraphImages";

import { ReviewOpenGraphImage } from "./ReviewOpenGraphImage";

type Props = {
  grade: GradeText;
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
