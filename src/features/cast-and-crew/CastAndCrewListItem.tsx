import { AvatarListItem } from "~/components/avatar-list/AvatarListItem";
import { ListItemCreditedAs } from "~/components/list-item-credited-as/ListItemCreditedAs";
import { ListItemName } from "~/components/list-item-name/ListItemName";

import type { CastAndCrewValue } from "./CastAndCrew";
import type { CastAndCrewSort } from "./sortCastAndCrew";

export function CastAndCrewListItem({
  sort,
  value,
}: {
  sort: CastAndCrewSort;
  value: CastAndCrewValue;
}): React.JSX.Element {
  switch (sort) {
    case "name-asc":
    case "name-desc": {
      return <NameSortListItem value={value} />;
    }
    case "review-count-asc":
    case "review-count-desc": {
      return <ReviewCountSortListItem value={value} />;
    }
  }
}

function NameSortListItem({
  value,
}: {
  value: CastAndCrewValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName
          href={`/cast-and-crew/${value.slug}/`}
          name={value.sortName}
        />
        <div className="mt-1">
          <ListItemCreditedAs values={value.creditedAs} />
        </div>
        <div
          className={`
            mt-[6px] font-sans text-[13px] font-normal tracking-prose
            text-nowrap text-subtle
          `}
        >
          {value.reviewCount} Reviews
        </div>
      </div>
    </AvatarListItem>
  );
}

function ReviewCountSortListItem({
  value,
}: {
  value: CastAndCrewValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName
          href={`/cast-and-crew/${value.slug}/`}
          name={value.name}
        />
        <div className="font-sans text-sm/5 text-muted tabular-nums">
          {value.reviewCount} Reviews
        </div>
        <ListItemCreditedAs
          className="mt-1 text-[13px]"
          values={value.creditedAs}
        />
      </div>
    </AvatarListItem>
  );
}
