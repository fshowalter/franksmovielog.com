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
        slug: collection.slug,
        name: collection.name,
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
      sectionHead: "Collections",
      backdrop: await getOpenGraphBackdropAsBase64String(slug),
    }),
  );

  return new Response(jpeg, {
    headers: {
      "Content-Type": "image/jpg",
    },
  });
};
