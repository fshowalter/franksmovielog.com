import { Grade } from "~/components/grade/Grade";

/**
 * Displays a letter grade in a list item.
 * @param props - Component props
 * @param props.grade - The letter grade to display (e.g., "A", "B+")
 * @returns Styled grade component
 */
export function ListItemGrade({ grade }: { grade: string }): React.JSX.Element {
  return <Grade className="pb-px" height={15} value={grade} />;
}
