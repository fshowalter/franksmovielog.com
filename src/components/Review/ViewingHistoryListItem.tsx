import type { ReviewContent } from "src/api/reviews";
import { DateIcon } from "src/components/DateIcon";
import { RenderedMarkdown } from "src/components/RenderedMarkdown";

type Viewing = ReviewContent["viewings"][0];

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
      <span className="inline-block font-sans-narrow text-sm font-medium tracking-normal text-subtle">
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
    <span className="text-subtle">
      <span>via</span>{" "}
      <span className="font-sans-narrow text-sm font-medium text-subtle">
        {value}
      </span>
    </span>
  );
}

function MediumNotes({ value }: { value: Viewing["mediumNotes"] }) {
  if (!value) {
    return null;
  }
  return (
    <span className="font-normal text-subtle">
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={value}
        className="leading-none"
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
    <span className="text-sm font-normal leading-none text-subtle">
      (
      <RenderedMarkdown
        // eslint-disable-next-line react/no-danger
        text={value}
        as="span"
        className="leading-none"
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
    <span className="text-subtle">
      <span>at</span>{" "}
      <span className="font-sans-narrow text-sm font-medium">{value}</span>
    </span>
  );
}

function ViewingNotes({ value }: { value: Viewing["viewingNotes"] }) {
  if (!value) {
    return null;
  }
  return (
    <div className="pb-6 text-sm font-light">
      <RenderedMarkdown
        className="leading-normal text-muted"
        // eslint-disable-next-line react/no-danger
        text={value}
      />
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
