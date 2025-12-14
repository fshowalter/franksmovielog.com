import { Grade } from "~/components/grade/Grade";

/**
 * Card component displaying a movie review summary.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "div")
 * @param props.imageConfig - Image sizing configuration
 * @param props.value - Review data to display
 * @param props.variant - Visual style variant ("primary" or "secondary")
 * @returns Review card with still image, title, grade, and excerpt
 */
export function CardGrade({ grade }: { grade: string }): React.JSX.Element {
  return (
    <Grade
      className={`
        mb-5
        tablet:mb-8
      `}
      height={24}
      value={grade}
    />
  );
}
