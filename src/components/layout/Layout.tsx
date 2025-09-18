import type { BackdropProps } from "./Backdrop";

import { Backdrop } from "./Backdrop";
import { Footer } from "./Footer";
import { Mast } from "./Mast";

/**
 * Main layout wrapper component with header, footer, and optional backdrop.
 * @param props - Component props
 * @param props.backdrop - Optional backdrop image configuration
 * @param props.children - Page content to render
 * @param props.className - Additional CSS classes for the main element
 * @param props.hideLogo - Whether to hide the logo in the header
 * @returns Layout container with skip link, header, main content, and footer
 */
export function Layout({
  backdrop,
  children,
  className,
  hideLogo = false,
  ...rest
}: {
  [x: string]: unknown;
  backdrop?: BackdropProps;
  children: React.ReactNode;
  className?: string;
  hideLogo?: boolean;
}): React.JSX.Element {
  return (
    <div className="group">
      <a
        className={`
          absolute top-0.5 left-1/2 z-skip-link mx-auto
          [transform:translate(-50%,calc(-100%-2px))]
          bg-subtle px-6 py-2 text-center text-accent
          focus:[transform:translate(-50%,0%)]
        `}
        href="#content"
      >
        Skip to content
      </a>
      <div className="flex min-h-full w-full flex-col bg-default">
        <Mast hasBackdrop={backdrop ? true : false} hideLogo={hideLogo} />
        <main
          className={`
            grow
            ${className ?? ""}
          `}
          id="content"
          {...rest}
        >
          {backdrop && <Backdrop {...backdrop} />}
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
