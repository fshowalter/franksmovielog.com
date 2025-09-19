import { gradeMap } from "./gradeMap";

/**
 * Displays a visual letter grade with star icons.
 * @param props - Component props
 * @param props.className - Additional CSS classes
 * @param props.height - Height of the grade display in pixels
 * @param props.value - Letter grade value (e.g., "A", "B+")
 * @returns Grade display with star icons
 */
export function Grade({
  className,
  height,
  value,
}: {
  className?: string;
  height: 15 | 16 | 18 | 24 | 32;
  value: string;
}): React.JSX.Element {
  const [src, alt] = gradeMap[value];

  const width = height * 5;

  return (
    <picture>
      <source
        media="(prefers-color-scheme: dark)"
        srcSet={src.replace(".svg", "-dark.svg")}
      />
      <img
        alt={`${value}: ${alt}`}
        className={className}
        height={height}
        src={src}
        width={width}
      />
    </picture>
  );
}
