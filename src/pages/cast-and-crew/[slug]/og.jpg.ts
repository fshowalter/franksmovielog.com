import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getOpenGraphBackdropAsBase64String } from "~/api/backdrops";
import { allCastAndCrew } from "~/api/castAndCrew";
import { OpenGraphImage } from "~/components/OpenGraphImage";
import { componentToImage } from "~/utils/componentToImage";

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export async function getStaticPaths() {
  const { castAndCrew } = await allCastAndCrew();

  return castAndCrew.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        name: member.name,
        slug: member.slug,
      },
    };
  });
}

export const GET: APIRoute = async function get({ props }) {
  const { name, slug } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String(slug),
      title: name,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
