export type NavItem = {
  subItems: NavItem[];
  target: string;
  text: string;
};

export const navItems: NavItem[] = [
  {
    subItems: [],
    target: "/",
    text: "Home",
  },
  {
    subItems: [],
    target: "/how-i-grade/",
    text: "How I Grade",
  },
  {
    subItems: [
      {
        subItems: [],
        target: "/reviews/overrated/",
        text: "Overrated Disappointments",
      },
      {
        subItems: [],
        target: "/reviews/underrated/",
        text: "Underrated Surprises",
      },
      {
        subItems: [],
        target: "/reviews/underseen/",
        text: "Underseen Gems",
      },
    ],
    target: "/reviews/",
    text: "Reviews",
  },
  {
    subItems: [
      {
        subItems: [],
        target: "/viewings/stats/",
        text: "Stats",
      },
    ],
    target: "/viewings/",
    text: "Viewing Log",
  },
  {
    subItems: [],
    target: "/cast-and-crew/",
    text: "Cast & Crew",
  },
  {
    subItems: [],
    target: "/collections/",
    text: "Collections",
  },
  {
    subItems: [
      {
        subItems: [],
        target: "/watchlist/progress/",
        text: "Progress",
      },
    ],
    target: "/watchlist/",
    text: "Watchlist",
  },
];
