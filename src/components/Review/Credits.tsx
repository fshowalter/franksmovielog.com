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
  | "releaseYear"
  | "runtimeMinutes"
  | "title"
  | "writerNames"
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
  releaseYear,
  runtimeMinutes,
  title,
  writerNames,
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
          <Credit term="Year" value={releaseYear} />
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
          relative mx-auto mt-8 flex w-full max-w-button transform-gpu
          cursor-pointer place-content-center items-center py-5 font-sans
          text-xs tracking-wide uppercase shadow-all transition-all
          before:absolute before:bottom-0 before:left-0 before:-z-10
          before:h-full before:w-full before:origin-center before:scale-x-0
          before:bg-inverse before:transition-transform
          hover:scale-105 hover:text-inverse hover:before:scale-100
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
