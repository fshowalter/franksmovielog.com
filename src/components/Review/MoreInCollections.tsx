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
            inline-block transform-gpu transition-transform
            hover:scale-110
          `}
          href={`/collections/${value.slug}/`}
        >
          More <span className="text-accent">{value.name}</span>
        </a>
      </SubHeading>
    </MoreReviews>
  ));
}
