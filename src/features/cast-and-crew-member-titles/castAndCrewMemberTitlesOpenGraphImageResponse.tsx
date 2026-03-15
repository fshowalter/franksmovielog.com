import { getOpenGraphBackdrop } from "~/assets/backdrops";
import { OpenGraphImage } from "~/components/open-graph-image/OpenGraphImage";
import { componentToImageResponse } from "~/utils/componentToImageResponse";

/**
 * Props for the Author Open Graph image component
 */
type Props = {
  /** Author's display name */
  name: string;
  slug: string;
};

export async function castAndCrewMemberTitlesOpenGraphImageResponse({
  name,
  slug,
}: Props): Promise<Response> {
  const backdrop = await getOpenGraphBackdrop(slug);

  return await componentToImageResponse(<OpenGraphImage title={name} />, [
    {
      data: backdrop,
      src: "backdrop",
    },
  ]);
}
