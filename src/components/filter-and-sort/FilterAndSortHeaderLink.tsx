/**
 * Link component for filter and sort header navigation.
 * @param props - Component props
 * @param props.href - Link destination URL
 * @param props.text - Link text to display
 * @returns Styled header link with hover effect
 */
export function FilterAndSortHeaderLink({
  href,
  text,
}: {
  href: string;
  text: string;
}): React.JSX.Element {
  return (
    <div
      className={`
        flex items-start gap-x-4 bg-default px-4 font-sans text-[13px] font-bold
        text-nowrap text-accent uppercase
      `}
    >
      <a
        className={`
          relative inline-block transform-gpu py-1 transition-transform
          after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
          after:origin-center after:scale-x-0 after:bg-accent
          after:transition-transform after:duration-500
          hover:after:scale-x-100
        `}
        href={href}
      >
        {text}
      </a>
    </div>
  );
}
