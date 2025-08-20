import type { Review } from "~/api/reviews";
import type { StillImageProps } from "~/api/stills";

import { MoreReviews } from "~/components/MoreReviews";
import { SubHeading } from "~/components/SubHeading";

type Collection = Omit<Review["moreCollections"][number], "titles"> & {
  titles: CollectionTitle[];
};

type CollectionTitle = Review["moreCollections"][number]["titles"][number] & {
  excerpt: string;
  stillImageProps: StillImageProps;
};

type Props = {
  values: Collection[];
};

export function MoreInCollections({ values }: Props) {
  return values.map((value) => (
    <MoreReviews key={value.slug} values={value.titles}>
      <SubHeading as="h2">
        <a
          className={`
            relative -mb-1 inline-block transform-gpu pb-1 transition-transform
            after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full
            after:origin-center after:scale-0 after:bg-(--fg-accent)
            after:transition-transform
            hover:scale-105 hover:after:scale-100
          `}
          href={`/collections/${value.slug}/`}
        >
          More <span className="text-accent">{value.name}</span>
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
