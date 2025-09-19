/**
 * Ordered list container for avatar items.
 * @param props - Component props
 * @param props.children - Avatar list items to render
 * @param props.className - Optional CSS classes
 * @returns Ordered list element for avatars
 */
export function AvatarList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}): React.JSX.Element {
  return (
    <ol className={className} data-testid="avatar-list">
      {children}
    </ol>
  );
}
