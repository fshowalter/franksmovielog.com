import type { PosterImageProps } from "src/api/posters";
import type { Review } from "src/api/reviews";
import { Poster } from "src/components/Poster";
import { ccn } from "src/utils/concatClassNames";
import { toSentence } from "src/utils/toSentence";

export const PosterImageConfig = {
  width: 248,
  height: 372,
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
  posterImageProps,
}: Props): JSX.Element {
  return (
    <aside
      id="credits"
      className={ccn(
        "bg-subtle px-container pb-8 pt-8 tablet:pt-12",
        className,
      )}
      data-pagefind-meta={`image:${posterImageProps.src}`}
    >
      <div className="flex flex-wrap justify-center gap-8 tablet:flex-nowrap">
        <div className="shrink-0">
          <div className="block">
            <Poster
              title={title}
              year={year}
              width={PosterImageConfig.width}
              height={PosterImageConfig.height}
              loading="lazy"
              className="h-auto"
              decoding="async"
              imageProps={posterImageProps}
              data-pagefind-meta="image[src], image_alt[alt]"
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
        href="#top"
        className="mx-auto mt-8 flex w-full max-w-[430px] cursor-pointer content-center items-center justify-center py-5 font-sans text-xs uppercase tracking-[.8px] shadow-all hover:bg-inverse hover:text-inverse"
      >
        Back to Top
      </a>
    </aside>
  );
}

function Credit({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-sans text-xs font-normal uppercase tracking-[0.8px] text-subtle">
        {term}
      </dt>
      <dd className="text-wrap font-normal text-muted">{value}</dd>
    </div>
  );
}
