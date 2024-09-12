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
      <header className="tablet:float-left tablet:mx-0 tablet:mr-gutter">
        <div className="mb-4 mt-0 block size-full w-full tablet:max-w-poster">
          <Poster
            title={title}
            year={year}
            width={PosterImageConfig.width}
            height={PosterImageConfig.height}
            sizes={PosterImageConfig.sizes}
            loading="lazy"
            className="h-auto"
            decoding="async"
            imageProps={posterImageProps}
            data-pagefind-meta="image[src], image_alt[alt]"
          />
        </div>
        <div className="font-serif-semibold text-center text-xl">
          {title} <span className="text-sm">({year})</span>
        </div>
        <div className="spacer-y-8 desktop:spacer-y-0" />
      </header>

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
      <div className="clear-both spacer-y-8" />
      {children}
      <div className="spacer-y-8" />
      <a
        href="#top"
        className="mx-auto flex max-w-[50%] cursor-pointer content-center items-center justify-center px-pageMargin py-5 font-sans-caps text-sm uppercase tracking-[.6px] shadow-all hover:text-accent hover:shadow-border-accent"
      >
        Back to Top
      </a>
    </aside>
  );
}

function Credit({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="overflow-hidden">
      <dt className="font-sans-caps text-xs uppercase text-subtle">{term}</dt>
      <dd className="font-normal text-muted">{value}</dd>
    </div>
  );
}
