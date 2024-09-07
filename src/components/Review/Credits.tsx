import type { PosterImageProps } from "src/api/posters";
import type { Review } from "src/api/reviews";
import { Poster } from "src/components/Poster";
import { ccn } from "src/utils/concatClassNames";
import { toSentence } from "src/utils/toSentence";

export const PosterImageConfig = {
  width: 248,
  height: 372,
  sizes: "(min-width: 248px) 248px, 100vw",
};

interface Props
  extends Pick<
    Review,
    | "title"
    | "year"
    | "originalTitle"
    | "countries"
    | "runtimeMinutes"
    | "directorNames"
    | "principalCastNames"
    | "writerNames"
  > {
  className?: string;
  children: React.ReactNode;
  posterImageProps: PosterImageProps;
}

export function Credits({
  title,
  year,
  originalTitle,
  countries,
  runtimeMinutes,
  directorNames,
  principalCastNames,
  writerNames,
  className,
  children,
  posterImageProps,
}: Props): JSX.Element {
  return (
    <aside
      id="credits"
      className={ccn(
        "relative scroll-mt-[var(--header-offset)] bg-subtle px-gutter pb-8 pt-8 tablet:pt-12",
        className,
      )}
      data-pagefind-meta={`image:${posterImageProps.src}`}
    >
      <header className="flex items-center justify-center gap-x-2 pb-6 text-center text-4xl font-bold">
        {title} <span className="text-sm font-light text-subtle">({year})</span>
      </header>
      <div className="poster-border mx-auto mb-4 mt-0 block size-full max-w-poster bg-[#e9e7e0] tablet:float-left tablet:mx-0 tablet:mr-gutter">
        <Poster
          title={title}
          year={year}
          width={PosterImageConfig.width}
          height={PosterImageConfig.height}
          sizes={PosterImageConfig.sizes}
          loading="lazy"
          className="h-auto rounded-xl"
          decoding="async"
          imageProps={posterImageProps}
          data-pagefind-meta="image[src], image_alt[alt]"
        />
      </div>

      <dl className="flex flex-col gap-y-4">
        {originalTitle && (
          <Credit term="Original Title" value={originalTitle} />
        )}
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
      <div className="h-8 min-h-8" />
      {children}
      <div className="h-8 min-h-8" />
      <a
        href="#top"
        className="mx-auto flex max-w-[50%] cursor-pointer content-center items-center justify-center rounded-lg p-2 font-sans text-accent shadow-all hover:shadow-border-accent"
      >
        Back to Top
        <svg viewBox="0 0 24 24" className="size-6 fill-default">
          <path d="M7.997 10l3.515-3.79a.672.672 0 0 1 .89-.076l.086.075L16 10 13 10.001V18h-2v-7.999L7.997 10z"></path>
        </svg>
      </a>
    </aside>
  );
}

function Credit({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <dt className="font-bold text-subtle">{term}</dt>
      <dd className="font-normal text-subtle">{value}</dd>
    </div>
  );
}
