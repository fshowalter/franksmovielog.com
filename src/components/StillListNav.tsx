export function StillListNav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="relative mx-auto flex w-full max-w-[1696px] flex-col items-center px-20">
      {children}
    </nav>
  );
}
