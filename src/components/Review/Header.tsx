import type { Review } from "src/api/reviews";
import { PageTitle } from "src/components/PageTitle";
import { ccn } from "src/utils/concatClassNames";

interface Props
  extends Pick<
    Review,
    "title" | "originalTitle" | "year" | "countries" | "runtimeMinutes"
  > {
  className?: string;
}

export function Header({
  title,
  originalTitle,
  year,
  countries,
  runtimeMinutes,
  className,
}: Props) {
  return (
    <>
      <h1 data-pagefind-meta="title" className="text-7xl font-bold">
        {title}
      </h1>
      <OriginalTitle value={originalTitle} />
      <Meta year={year} countries={countries} runtimeMinutes={runtimeMinutes} />
    </>
  );
}

function OriginalTitle({ value }: { value: string | null }) {
  if (!value) {
    return null;
  }

  return <div className="text-muted">({value})</div>;
}

function Meta({
  year,
  countries,
  runtimeMinutes,
}: Pick<Props, "year" | "countries" | "runtimeMinutes">) {
  return (
    <div className="font-sans text-sm tracking-[.6px]">
      {year} <span>|</span>{" "}
      {countries.reduce<JSX.Element | null>((acc, country) => {
        if (acc === null) {
          return <>{country}</>;
        }

        return (
          <>
            {acc}
            <span>&ndash;</span>
            {country}
          </>
        );
      }, null)}{" "}
      <span>|</span> {runtimeMinutes}
      &#x02009;min{" "}
      <span>
        <span>|</span> <a href="#credits">More...</a>
      </span>
    </div>
  );
}
