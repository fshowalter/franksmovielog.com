import React, { StrictMode } from "react";

import { Watchlist } from "~/features/watchlist/Watchlist";

export function StrictModeWrapper({
  children,
  props,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <StrictMode>
      <Watchlist {...props} />
    </StrictMode>
  );
}
