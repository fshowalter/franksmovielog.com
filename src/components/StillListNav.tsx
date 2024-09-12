export function StillListNav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="relative mx-auto flex w-full max-w-screen-max flex-col items-center px-[8%] desktop:px-20">
      {children}
    </nav>
  );
}
