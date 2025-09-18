import { AvatarListItem } from "~/components/avatar-list/AvatarListItem";
import { ListItemCreditedAs } from "~/components/list-item-credited-as/ListItemCreditedAs";
import { ListItemName } from "~/components/list-item-name/ListItemName";

import type { CastAndCrewValue } from "./CastAndCrew";

/**
 * List item component for displaying a cast or crew member.
 * @param props - Component props
 * @param props.value - Cast/crew member data to display
 * @returns List item with avatar, name, credits, and review count
 */
export function CastAndCrewListItem({
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
