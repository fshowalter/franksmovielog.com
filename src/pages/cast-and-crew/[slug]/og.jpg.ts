import type { APIRoute, InferGetStaticPropsType } from "astro";
import { getOpenGraphBackdropAsBase64String } from "src/api/backdrops";
import { allCastAndCrew } from "src/api/castAndCrew";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { castAndCrew } = await allCastAndCrew();

  return castAndCrew.map((member) => {
    return {
      params: {
        slug: member.slug,
      },
      props: {
        slug: member.slug,
        name: member.name,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { slug, name } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      title: name,
      backdrop: await getOpenGraphBackdropAsBase64String(slug),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
