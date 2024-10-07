import type { APIRoute, InferGetStaticPropsType } from "astro";
import { getOpenGraphBackdropAsBase64String } from "src/api/backdrops";
import { allStatYears } from "src/api/yearStats";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

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

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { year } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: `${year} Stats`,
      backdrop: await getOpenGraphBackdropAsBase64String(year),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
