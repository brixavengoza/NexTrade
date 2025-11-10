export const config = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME || "Next.js Boilerplate",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  },
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
    timeout: 30000,
  },
} as const;
