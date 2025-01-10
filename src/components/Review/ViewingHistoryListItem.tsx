import type { ReviewContent } from "~/api/reviews";

import { RenderedMarkdown } from "~/components/RenderedMarkdown";

type Viewing = ReviewContent["viewings"][0];

const monthFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  timeZone: "UTC",
});

const yearFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
});

const dayFormat = new Intl.DateTimeFormat("en-US", {
  day: "numeric",
  timeZone: "UTC",
});

const weekdayFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  weekday: "short",
});

export function ViewingHistoryListItem({ value }: { value: Viewing }) {
  return (
    <li className="mb-1 flex flex-col bg-subtle font-sans text-xs font-light tablet:px-4">
      <div className="flex items-center gap-x-4 py-4 tablet:gap-x-6">
        <div className="size-auto">
          <Date date={value.date} />
        </div>
        <div className="grow">
          <Medium value={value.medium} />
          <MediumNotes value={value.mediumNotes} />
          <Venue addArticle={!!value.medium} value={value.venue} />{" "}
          <VenueNotes value={value.venueNotes} />
        </div>
      </div>
      <div>
        <ViewingNotes value={value.viewingNotes} />
      </div>
    </li>
  );
}

function Date({ date }: { date: Date }) {
  return (
    <div className="bg-subtle p-2 text-center">
      <div className="px-4 pb-2 font-serif text-md font-normal text-subtle">
        {yearFormat.format(date)}
      </div>
      <div className="bg-default py-1 text-subtle">
        {monthFormat.format(date)}
      </div>
      <div className="bg-default font-serif text-md font-normal text-default">
        {dayFormat.format(date)}
      </div>
      <div className="bg-default py-1 text-subtle">
        {weekdayFormat.format(date)}
      </div>
    </div>
  );
}

function Medium({ value }: { value: Viewing["medium"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="font-serif text-base font-normal text-default">
      {value}
    </span>
  );
}

function MediumNotes({ value }: { value: Viewing["mediumNotes"] }) {
  if (!value) {
    return false;
  }
  return (
    <span className="font-light tracking-normal text-subtle">
      {" "}
      (
      <RenderedMarkdown as="span" className="leading-none" text={value} />)
    </span>
  );
}

function Venue({
  addArticle,
  value,
}: {
  addArticle: boolean;
  value: Viewing["venue"];
}) {
  if (!value) {
    return false;
  }
  return (
    <span className="text-subtle">
      {addArticle && <span> at </span>}
      <span className="font-serif text-base font-normal text-default">
        {value}
      </span>
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

function ViewingNotes({ value }: { value: Viewing["viewingNotes"] }) {
  if (!value) {
    return false;
  }
  return (
    <div className="mx-4 pb-6 text-sm font-light tablet:ml-28 tablet:mr-20">
      <RenderedMarkdown
        className="leading-normal tracking-prose text-muted"
        text={value}
      />
    </div>
  );
}
