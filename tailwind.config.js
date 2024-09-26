const PROSE_CONTENT_WIDTH = "39rem";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    backgroundColor: {
      accent: "var(--bg-accent)",
      canvas: "var(--bg-canvas)",
      default: "var(--bg-default)",
      footer: "var(--bg-footer)",
      inverse: "var(--bg-inverse)",
      stripe: "var(--bg-stripe)",
      subtle: "var(--bg-subtle)",
      unset: "unset",
    },
    borderColor: {
      default: "var(--border-default)",
    },
    colors: {
      accent: "var(--fg-accent)",
      border: "var(--border-default)",
      "border-accent": "var(--border-accent)",
      default: "var(--fg-default)",
      muted: "var(--fg-muted)",
      inverse: "var(--fg-inverse)",
      "inverse-subtle": "var(--fg-inverse-subtle)",
      subtle: "var(--fg-subtle)",
      inherit: "inherit",
      emphasis: "var(--fg-emphasis)",
      progress: "var(--fg-progress)",
    },
    screens: {
      tablet: "768px",
      "tablet-landscape": "1024px",
      desktop: "1280px",
      max: "1696px",
    },
    extend: {
      aspectRatio: {
        poster: "1 / 1.5",
      },
      boxShadow: {
        all: "0 0 0 1px var(--border-default)",
        bottom: "0px 1px var(--border-default)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        serif: "var(--font-serif)",
      },
      fontSize: {
        "2.5xl": "1.625rem",
        md: ["1.125rem", "1.5rem"],
        xxs: "0.625rem",
      },
      maxWidth: {
        prose: PROSE_CONTENT_WIDTH,
        popout: `calc(64px + ${PROSE_CONTENT_WIDTH})`,
        unset: "unset",
      },
      padding: {
        container: "var(--container-padding)",
      },
    },
  },
};
