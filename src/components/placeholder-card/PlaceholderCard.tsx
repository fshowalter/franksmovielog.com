import type { StillImageProps } from "~/api/stills";

import { CardBodyPadding } from "~/components/card-body-padding/CardBodyPadding";
import { CardEyebrow } from "~/components/card-eyebrow/CardEyebrow";
import { CardFooter } from "~/components/card-footer/CardFooter";
import { CardStill } from "~/components/card-still/CardStill";
import { CardTitle } from "~/components/card-title/CardTitle";

/**
 * Card component for displaying unreviewed or placeholder movie titles.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.bodyText - Content to display in the card body
 * @param props.eyebrow - Content to display above the title
 * @param props.footer - Content to display in the card footer
 * @param props.releaseYear - The movie's release year
 * @param props.stillImageConfig - Image sizing configuration
 * @param props.stillImageProps - Still image properties
 * @param props.title - The movie title
 * @returns Placeholder card with still image, title, and content
 */
export function PlaceholderCard({
  as = "div",
  bodyText,
  eyebrow,
  footer,
  releaseYear,
  stillImageConfig,
  stillImageProps,
  title,
}: {
  as?: React.ElementType;
  bodyText: React.ReactNode;
  eyebrow: React.ReactNode;
  footer: React.ReactNode;
  releaseYear: string;
  stillImageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  stillImageProps: StillImageProps;
  title: string;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        group/card relative mb-1 flex w-(--card-width,100%) flex-col
        bg-default/50 px-[8%] pt-12
        tablet:mb-0 tablet:px-0 tablet:pt-0
      `}
    >
      <CardStill imageConfig={stillImageConfig} imageProps={stillImageProps} />
      <CardBodyPadding>
        <CardEyebrow>{eyebrow}</CardEyebrow>
        <CardTitle
          releaseYear={releaseYear}
          textColorClassNames="text-subtle"
          title={title}
        />
        <div className="mt-1 mb-9">{bodyText}</div>
        <CardFooter>{footer}</CardFooter>
      </CardBodyPadding>
    </Component>
  );
}
