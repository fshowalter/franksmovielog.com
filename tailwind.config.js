const PROSE_CONTENT_WIDTH = "39rem";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,js,jsx,md,mdx,ts,tsx}"],
  theme: {
    backgroundColor: {
      accent: "var(--bg-accent)",
      default: "var(--bg-default)",
      subtle: "var(--bg-subtle)",
      canvas: "var(--bg-canvas)",
      inverse: "var(--bg-inverse)",
      stripe: "var(--bg-stripe)",
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
      subtle: "var(--fg-subtle)",
      inherit: "inherit",
      emphasis: "var(--fg-emphasis)",
      progress: "var(--fg-progress)",
    },
    screens: {
      tablet: "768px",
      showFilters: "1024px",
      desktop: "1280px",
      max: "1696px",
    },
    extend: {
      boxShadow: {
        all: "0 0 0 1px var(--border-default)",
        bottom: "0px 1px var(--border-default)",
      },
      brightness: {
        dark: "0.8",
      },
      contrast: {
        dark: "1.2",
      },
      flexBasis: {
        md: "28rem",
      },
      fontFamily: {
        sans: "ArgentumSans",
        "sans-narrow": "Radio Canada Big",
        serif: "FrankRuhlLibre",
      },
      fontSize: {
        "2.5xl": "1.625rem",
        md: ["1.125rem", "1.5rem"],
        xxs: "0.625rem",
      },
      letterSpacing: {
        "0.25px": "0.015625rem",
        "0.3px": "0.01875rem",
        "0.5px": "0.03125rem",
        "0.75px": "0.046875rem",
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

// .3
// .5
// .6
// .8
// 0
// 1
// 1.1
// 1.2
// 2
