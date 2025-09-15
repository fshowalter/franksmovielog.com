import { AvatarListItem } from "~/components/avatar-list/AvatarListItem";
import { ListItemName } from "~/components/list-item-name/ListItemName";

import type { CollectionsValue } from "./Collections";

export function CollectionsListItem({
  value,
}: {
  value: CollectionsValue;
}): React.JSX.Element {
  return (
    <AvatarListItem avatarImageProps={value.avatarImageProps}>
      <div className="flex flex-col justify-center">
        <ListItemName href={`/collections/${value.slug}/`} name={value.name} />
        <div
          className={`
            font-sans text-[13px] font-normal tracking-prose text-nowrap
            text-subtle
          `}
        >
          {value.reviewCount} Reviews
        </div>
      </div>
    </AvatarListItem>
  );
}
