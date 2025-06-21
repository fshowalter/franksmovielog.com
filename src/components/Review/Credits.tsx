import type { JSX } from "react";

import type { PosterImageProps } from "~/api/posters";
import type { Review } from "~/api/reviews";

import { Poster } from "~/components/Poster";
import { ccn } from "~/utils/concatClassNames";
import { toSentence } from "~/utils/toSentence";

export const PosterImageConfig = {
  height: 372,
  width: 248,
};

type Props = Pick<
  Review,
  | "countries"
  | "directorNames"
  | "originalTitle"
  | "principalCastNames"
  | "runtimeMinutes"
  | "title"
  | "writerNames"
  | "year"
> & {
  className?: string;
  posterImageProps: PosterImageProps;
};

export function Credits({
  className,
  countries,
  directorNames,
  originalTitle,
  posterImageProps,
  principalCastNames,
  runtimeMinutes,
  title,
  writerNames,
  year,
}: Props): JSX.Element {
  return (
    <aside
      className={ccn(
        `
          bg-subtle px-container pt-8 pb-8
          tablet:pt-12
        `,
        className,
      )}
      data-pagefind-meta={`image:${posterImageProps.src}`}
      id="credits"
    >
      <div
        className={`
          flex flex-wrap justify-center gap-8
          tablet:flex-nowrap
        `}
      >
        <div className="shrink-0">
          <div className="block">
            <Poster
              className="h-auto"
              decoding="async"
              height={PosterImageConfig.height}
              imageProps={posterImageProps}
              loading="lazy"
              width={PosterImageConfig.width}
            />
          </div>
        </div>

        <dl className="flex min-w-0 shrink flex-col items-start gap-y-4">
          <Credit term="Title" value={title} />
          {originalTitle && (
            <Credit term="Original Title" value={originalTitle} />
          )}
          <Credit term="Year" value={year} />
          <Credit term="Financing" value={toSentence(countries)} />
          <Credit term="Running Time" value={`${runtimeMinutes} min`} />
          <Credit
            term="Directed by"
            value={directorNames.map((name) => (
              <div key={name}>{name}</div>
            ))}
          />
          <Credit
            term="Written by"
            value={writerNames.map((name) => (
              <div key={name}>{name}</div>
            ))}
          />
          <Credit term="Starring" value={toSentence(principalCastNames)} />
        </dl>
      </div>
      <a
        className={`
          mx-auto mt-8 flex w-full max-w-button cursor-pointer
          place-content-center items-center py-5 font-sans text-xs tracking-wide
          uppercase shadow-all
          hover:bg-inverse hover:text-inverse
        `}
        href="#top"
      >
        Back to Top
      </a>
    </aside>
  );
}

function Credit({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-sans text-xxs tracking-wide text-subtle uppercase">
        {term}
      </dt>
      <dd className="font-normal text-wrap text-muted">{value}</dd>
    </div>
  );
}
