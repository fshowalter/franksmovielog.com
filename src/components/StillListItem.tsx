import type { StillImageProps } from "src/api/stills";

import { Grade } from "./Grade";
import { Still } from "./Still";

export const StillListItemImageConfig = {
  width: 312,
  height: 175.5,
  sizes:
    "(min-width: 706px) 312px, (min-width: 1280) 25vw, (min-width: 1472px) 312px, 50vw",
  quality: 80,
};

export interface StillListItemValue {
  title: string;
  grade: string;
  slug: string;
  year: string;
  genres: string[];
  stillImageProps: StillImageProps;
}

export function StillListItem({ value }: { value: StillListItemValue }) {
  return (
    <li className="flow-root w-full px-gutter py-6 even:bg-subtle tablet:grid tablet:max-w-[312px] tablet:grid-rows-[auto_auto_1fr_auto] tablet:gap-y-2 tablet:overflow-hidden tablet:rounded-lg tablet:bg-default tablet:p-0 tablet:pb-8 tablet:shadow-all tablet:shadow-border tablet:even:bg-default">
      <div className="row-start-1 row-end-1">
        <a
          href={`/reviews/${value.slug}/`}
          className="safari-border-radius-fix float-right mb-2 ml-6 block w-[calc(50%_-_12px)] max-w-[312px] overflow-hidden rounded-lg tablet:float-none tablet:m-0 tablet:w-auto tablet:rounded-none"
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
      <div className="row-start-2 mb-2 tablet:m-0 tablet:px-6">
        <a
          href={`/reviews/${value.slug}/`}
          className="block text-md font-semibold text-default"
        >
          {value.title}{" "}
          <span className="text-sm font-light leading-none text-muted">
            {value.year}
          </span>
        </a>
      </div>
      <div className="mb-6 tablet:m-0 tablet:px-6 tablet:pb-6">
        <Grade value={value.grade} height={16} />
      </div>
      <div className="tablet:px-6">
        <Genres values={value.genres} />
      </div>
    </li>
  );
}

function Genres({ values }: { values: readonly string[] }): JSX.Element | null {
  return (
    <div className="font-sans text-sm leading-4 tracking-0.5px text-subtle">
      {values.map((value, index) => {
        if (index === 0) {
          return <span key={value}>{value}</span>;
        }

        return <span key={value}> | {value}</span>;
      })}
    </div>
  );
}
