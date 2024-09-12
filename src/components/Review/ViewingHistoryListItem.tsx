import type { ReviewWithContent } from "src/api/reviews";
import { DateIcon } from "src/components/DateIcon";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";

type Viewing = ReviewWithContent["viewings"][0];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function Date({ date }: { date: Date }) {
  return (
    <>
      <span className="inline-block text-default">
        {dateFormat.format(date)}
      </span>{" "}
    </>
  );
}

function Medium({ value }: { value: Viewing["medium"] }) {
  if (!value) {
    return null;
  }
  return (
    <span className="font-light text-muted">
      <span>via</span> <span>{value}</span>
    </span>
  );
}

function MediumNotes({ value }: { value: Viewing["mediumNotes"] }) {
  if (!value) {
    return null;
  }
  return (
    <span className="text-sm font-light leading-none text-subtle">
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={value}
        className="text-sm leading-none"
        as="span"
      />
      )
    </span>
  );
}

function VenueNotes({ value }: { value: Viewing["venueNotes"] }) {
  if (!value) {
    return null;
  }
  return (
    <span className="text-sm font-light leading-none text-subtle">
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={value}
        as="span"
        className="text-sm leading-none"
      />
      )
    </span>
  );
}

function Venue({ value }: { value: Viewing["venue"] }) {
  if (!value) {
    return null;
  }
  return (
    <span className="font-light text-subtle">
      <span>at</span> <span>{value}</span>
    </span>
  );
}

function ViewingNotes({ value }: { value: Viewing["viewingNotes"] }) {
  if (!value) {
    return null;
  }
  return (
    <div className="pb-6">
      <RenderedMarkdown
        className="leading-normal text-default"
        // eslint-disable-next-line react/no-danger
        text={value}
      />
    </div>
  );
}

export function ViewingHistoryListItem({ value }: { value: Viewing }) {
  return (
    <li className="flex flex-col font-sans-book text-sm even:bg-subtle">
      <div className="flex items-center gap-x-[1ch] py-4">
        <div className="size-auto">
          <DateIcon className="w-4" />{" "}
        </div>
        <div className="grow">
          <Date date={value.date} />
          <Medium value={value.medium} />{" "}
          <MediumNotes value={value.mediumNotes} />
          <Venue value={value.venue} /> <VenueNotes value={value.venueNotes} />
        </div>
      </div>
      <div>
        <ViewingNotes value={value.viewingNotes} />
      </div>
    </li>
  );
}
