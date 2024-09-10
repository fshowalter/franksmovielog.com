import type { StillImageProps } from "src/api/stills";

import { Grade } from "./Grade";
import { RenderedMarkdown } from "./RenderedMarkdown";
import { Still } from "./Still";

export const StillListItemImageConfig = {
  width: 435,
  height: 179,
  sizes:
    "(min-width: 706px) 312px, (min-width: 1280) 25vw, (min-width: 1472px) 312px, 50vw",
  quality: 80,
};

export interface StillListItemValue {
  title: string;
  grade: string;
  slug: string;
  year: string;
  excerpt: string;
  genres: string[];
  stillImageProps: StillImageProps;
}

export function StillListItem({ value }: { value: StillListItemValue }) {
  return (
    <li className="w-full">
      <div className="row-start-1 row-end-1">
        <a
          href={`/reviews/${value.slug}/`}
          className="safari-border-radius-fix float-right mb-2 ml-6 block w-[calc(50%_-_12px)] overflow-hidden tablet:float-none tablet:m-0 tablet:w-auto"
        >
          <Still
            title={value.title}
            year={value.year}
            imageProps={value.stillImageProps}
            width={StillListItemImageConfig.width}
            height={StillListItemImageConfig.height}
            className="h-auto"
            loading="lazy"
            decoding="async"
            sizes={StillListItemImageConfig.sizes}
          />
        </a>
      </div>
      <div className="flex flex-col bg-default py-6 pl-[12%] pr-[14%]">
        <div className="row-start-2">
          <a
            href={`/reviews/${value.slug}/`}
            className="font-serif-semibold block text-xl text-default"
          >
            {value.title}{" "}
            <span className="text-sm font-light leading-none text-muted">
              {value.year}
            </span>
          </a>
        </div>
        <div className="spacer-y-4" />
        <div className="">
          <Grade value={value.grade} height={18} />
        </div>
        <div className="spacer-y-4" />
        <RenderedMarkdown
          text={value.excerpt}
          className="text-base leading-[1.6] tracking-0.3px text-muted"
        />
        <div className="spacer-y-8" />
        <div className="">
          <Genres values={value.genres} />
        </div>
      </div>
    </li>
  );
}

function Genres({ values }: { values: readonly string[] }): JSX.Element | null {
  return (
    <div className="font-sans-caps text-[10px] uppercase leading-4 tracking-[0.8px] text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return <span key={value}> | {value}</span>;
      })}
    </div>
  );
}
