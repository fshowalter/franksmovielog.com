import type { APIRoute, InferGetStaticPropsType } from "astro";

import { getOpenGraphBackdropAsBase64String } from "src/api/backdrops";
import { allCollections } from "src/api/collections";
import { OpenGraphImage } from "src/components/OpenGraphImage";
import { componentToImage } from "src/utils/componentToImage";

export async function getStaticPaths() {
  const { collections } = await allCollections();

  return collections.map((collection) => {
    return {
      params: {
        slug: collection.slug,
      },
      props: {
        name: collection.name,
        slug: collection.slug,
      },
    };
  });
}

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

export const GET: APIRoute = async function get({ props }) {
  const { name, slug } = props as Props;

  const jpeg = await componentToImage(
    OpenGraphImage({
      backdrop: await getOpenGraphBackdropAsBase64String(slug),
      sectionHead: "Collections",
      title: name,
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
