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
