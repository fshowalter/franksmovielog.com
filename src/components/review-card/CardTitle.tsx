import type { StillImageProps } from "~/api/stills";

import { Grade } from "~/components/grade/Grade";
import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";
import { Still } from "~/components/still/Still";

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardTitle({
  as = "div",
  imageConfig,
  value,
  variant = "primary",
}: {
  as?: React.ElementType;
  imageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  value: ReviewCardValue;
  variant?: "primary" | "secondary";
}): React.JSX.Element {
  const Component = as;

  return (
    <a
      className={`
        mb-3 block font-medium text-default transition-all duration-500
        after:absolute after:top-0 after:left-0 after:z-sticky after:size-full
        hover:text-accent
        ${
          variant === "primary"
            ? `
                  text-2.5xl leading-7
                  tablet:text-2xl
                  laptop:text-2.5xl
                `
            : ""
        }
        ${variant === "secondary" ? `text-xl leading-6` : ""}
      `}
      href={`/reviews/${value.slug}/`}
    >
      {value.title}&nbsp;
      <span className="text-sm leading-none font-normal text-muted">
        {value.releaseYear}
      </span>
    </a>
  );
}
