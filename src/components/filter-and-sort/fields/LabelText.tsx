/**
 * Renders styled label text for form fields.
 * @param props - Component props
 * @param props.as - The element type to render (defaults to "span")
 * @param props.htmlFor - ID of the associated form control
 * @param props.value - The label text to display
 * @returns Styled label text element
 */
export function LabelText({
  as = "span",
  htmlFor,
  value,
}: {
  as?: React.ElementType;
  htmlFor?: string;
  value: string;
}): React.JSX.Element {
  const Component = as;

  return (
    <Component
      className={`
        inline-block h-6 text-left font-sans text-base leading-none
        font-semibold tracking-normal text-subtle
      `}
      htmlFor={htmlFor}
    >
      {value}
    </Component>
  );
}
