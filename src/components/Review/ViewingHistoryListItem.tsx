import type { ReviewContent } from "~/api/reviews";

import { DateIcon } from "~/components/DateIcon";
import { RenderedMarkdown } from "~/components/RenderedMarkdown";

type Viewing = ReviewContent["viewings"][0];

const dateFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  weekday: "short",
  year: "numeric",
});

function Date({ date }: { date: Date }) {
  return (
    <>
      <span className="inline-block font-sans text-xs font-normal tracking-normal text-subtle">
        {dateFormat.format(date)}
      </span>{" "}
    </>
  );
}

function Medium({ value }: { value: Viewing["medium"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="text-subtle">
      <span>via</span>{" "}
      <span className="font-sans text-xs font-normal text-subtle">{value}</span>
    </span>
  );
}

function MediumNotes({ value }: { value: Viewing["mediumNotes"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="font-light tracking-normal text-subtle">
      (
      <RenderedMarkdown as="span" className="leading-none" text={value} />)
    </span>
  );
}

function VenueNotes({ value }: { value: Viewing["venueNotes"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="font-light tracking-normal text-subtle">
      (
      <RenderedMarkdown as="span" className="leading-none" text={value} />)
    </span>
  );
}

function Venue({ value }: { value: Viewing["venue"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="text-subtle">
      <span>at</span>{" "}
      <span className="font-sans text-xs font-normal text-subtle">{value}</span>
    </span>
  );
}

function ViewingNotes({ value }: { value: Viewing["viewingNotes"] }) {
  if (!value) {
    return false;
  }
  return (
    <div className="pb-6 text-sm font-light tablet:mx-8">
      <RenderedMarkdown className="leading-normal text-muted" text={value} />
    </div>
  );
}

export function ViewingHistoryListItem({ value }: { value: Viewing }) {
  return (
    <li className="flex flex-col px-4 font-sans text-xs font-light even:bg-stripe">
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
