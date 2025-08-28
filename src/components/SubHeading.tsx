export function SubHeading({
  as,
  children,
  fontClasses = "font-sans font-bold",
  otherClasses,
  paddingClasses = "py-10",
  textClasses = "text-xs text-subtle uppercase",
  trackingClasses = "tracking-wide",
}: {
  as: "h2" | "h3" | "h4" | "h5";
  children: React.ReactNode;
  fontClasses?: string;
  otherClasses?: string;
  paddingClasses?: string;
  textClasses?: string;
  trackingClasses?: string;
}) {
  const Component = as;

  return (
    <Component
      className={`
        ${paddingClasses}
        ${fontClasses}
        ${textClasses}
        ${trackingClasses}
        ${otherClasses ?? ""}
      `}
    >
      {children}
    </Component>
  );
}
