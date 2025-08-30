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

export function ViewingHistoryListItem({
  value,
}: {
  value: Viewing;
}): React.JSX.Element {
  return (
    <li
      className={`
        mb-1 flex flex-col bg-subtle px-container font-sans text-sm font-normal
        tablet:px-6
      `}
    >
      <div
        className={`
          flex items-center gap-x-4 py-4
          tablet:gap-x-6
        `}
      >
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

function Date({ date }: { date: Date }): React.JSX.Element {
  return (
    <div className="bg-subtle py-2 text-center">
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

function Medium({
  value,
}: {
  value: Viewing["medium"];
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }
  return (
    <span className="font-serif text-base font-normal text-default">
      {value}
    </span>
  );
}

function MediumNotes({
  value,
}: {
  value: Viewing["mediumNotes"];
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }
  return (
    <span className="font-normal tracking-prose text-subtle">
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
}): false | React.JSX.Element {
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

function VenueNotes({
  value,
}: {
  value: Viewing["venueNotes"];
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }
  return (
    <span className="font-light tracking-normal text-muted">
      (
      <RenderedMarkdown as="span" className="leading-none" text={value} />)
    </span>
  );
}

function ViewingNotes({
  value,
}: {
  value: Viewing["viewingNotes"];
}): false | React.JSX.Element {
  if (!value) {
    return false;
  }
  return (
    <div
      className={`
        px-2 pb-6 text-base font-normal
        tablet:mx-24 tablet:px-0
      `}
    >
      <RenderedMarkdown
        className="leading-normal tracking-prose text-muted"
        text={value}
      />
    </div>
  );
}
