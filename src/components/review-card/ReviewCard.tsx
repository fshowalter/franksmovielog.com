import type { StillImageProps } from "~/api/stills";

import { CardBodyPadding } from "~/components/card-body-padding/CardBodyPadding";
import { CardElevatingContainer } from "~/components/card-elevating-container/CardElevatingContainer";
import { CardEyebrow } from "~/components/card-eyebrow/CardEyebrow";
import { CardFooter } from "~/components/card-footer/CardFooter";
import { CardStill } from "~/components/card-still/CardStill";
import { CardTitle } from "~/components/card-title/CardTitle";
import { Grade } from "~/components/grade/Grade";
import { RenderedMarkdown } from "~/components/rendered-markdown/RenderedMarkdown";

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.excerpt - Review excerpt text
 * @param props.eyebrow - Content to display above the title
 * @param props.footer - Content to display in the card footer
 * @param props.grade - Movie review grade
 * @param props.releaseYear - The movie's release year
 * @param props.slug - Review slug for linking to review page
 * @param props.stillImageConfig - Image sizing configuration
 * @param props.stillImageProps - Still image properties
 * @param props.title - The movie title
 * @returns Review card with still image, title, grade, and excerpt
 */
export function ReviewCard({
  as = "div",
  excerpt,
  eyebrow,
  footer,
  grade,
  releaseYear,
  slug,
  stillImageConfig,
  stillImageProps,
  title,
}: {
  as?: React.ElementType;
  excerpt: string;
  eyebrow: React.ReactNode;
  footer: React.ReactNode;
  grade: string;
  releaseYear: string;
  slug: string;
  stillImageConfig: {
    height: number;
    sizes: string;
    width: number;
  };
  stillImageProps: StillImageProps;
  title: string;
}): React.JSX.Element {
  return (
    <CardElevatingContainer as={as} mobilePadding={true}>
      <CardStill imageConfig={stillImageConfig} imageProps={stillImageProps} />
      <CardBodyPadding>
        <CardEyebrow>{eyebrow}</CardEyebrow>
        <CardTitle releaseYear={releaseYear} slug={slug} title={title} />
        <Grade
          className={`
            mb-5
            tablet:mb-8
          `}
          height={24}
          value={grade}
        />
        <RenderedMarkdown
          className={`leading-normal mb-6 text-lg tracking-prose text-muted`}
          text={excerpt}
        />
        <CardFooter>{footer}</CardFooter>
      </CardBodyPadding>
    </CardElevatingContainer>
  );
}
