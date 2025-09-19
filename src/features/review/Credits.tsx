import type { PosterImageProps } from "~/api/posters";

import { Poster } from "~/components/poster/Poster";
import { toSentence } from "~/utils/toSentence";

/**
 * Configuration for poster images in credits section.
 */
export const PosterImageConfig = {
  height: 372,
  width: 248,
};

/**
 * Component for displaying movie credits information.
 * @param props - Component props
 * @param props.className - Optional CSS classes
 * @param props.countries - Production countries
 * @param props.directorNames - Director names
 * @param props.originalTitle - Original movie title if different
 * @param props.posterImageProps - Poster image configuration
 * @param props.principalCastNames - Principal cast member names
 * @param props.releaseYear - Year of release
 * @param props.runtimeMinutes - Runtime in minutes
 * @param props.title - Movie title
 * @param props.writerNames - Writer names
 * @returns Credits component with poster and movie details
 */
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
}: {
  className?: string;
  countries: string[];
  directorNames: string[];
  originalTitle?: string;
  posterImageProps: PosterImageProps;
  principalCastNames: string[];
  releaseYear: string;
  runtimeMinutes: number;
  title: string;
  writerNames: string[];
}): React.JSX.Element {
  return (
    <aside
      className={`
        group/credits bg-subtle px-container pt-8 pb-8
        tablet:pt-12
        ${className ?? ""}
      `}
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
          mx-auto mt-8 hidden w-full max-w-button transform-gpu
          place-content-center items-center rounded-md py-5 font-sans text-sm
          tracking-wide uppercase shadow-all transition-all
          group-target/credits:flex
          hover:scale-105 hover:bg-footer hover:text-white hover:drop-shadow-lg
        `}
        href="#top"
      >
        Back to Top
      </a>
    </aside>
  );
}

function Credit({
  term,
  value,
}: {
  term: string;
  value: React.ReactNode;
}): React.JSX.Element {
  return (
    <div>
      <dt
        className={`
          font-sans text-xs leading-4 tracking-wide text-subtle uppercase
        `}
      >
        {term}
      </dt>
      <dd className="font-normal text-wrap text-muted">{value}</dd>
    </div>
  );
}
