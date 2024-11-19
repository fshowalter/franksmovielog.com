import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { allStatYears } from "~/api/yearStats";
import { OpenGraphImage } from "~/components/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const years = await allStatYears();

  return years.map((year) => {
    return {
      params: {
        year: year,
      },
      props: {
        year: year,
      },
    };
  });
}

export const GET: APIRoute = async function get({ props }) {
  const { year } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String(year),
      title: `${year} Stats`,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
