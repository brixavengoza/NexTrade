// App wide constants

export const APP_NAME = "NextTrade";
export const APP_DESCRIPTION =
  "A modern Next.js boilerplate with TypeScript, Tailwind CSS, and shadcn/ui components.";

export const ROUTES = {
  HOME: "/",
  TRADE: "/trade",
  PORTFOLIO: "/portfolio",
  LEADERBOARD: "/leaderboard",
  PROFILE: "/profile",
  COMPLIANCE: "/compliance",
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REGISTER: "/api/auth/register",
  },
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
