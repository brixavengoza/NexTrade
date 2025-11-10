# Next.js Boilerplate 🚀

A modern, production-ready Next.js boilerplate with TypeScript, Tailwind CSS, shadcn/ui, and Docker support.

## ✨ Features

- ⚡ **Next.js 16** - App Router with Server Components
- 🔷 **TypeScript** - Type safety and better developer experience
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible component library
- 🔮 **TanStack Query** - Powerful data fetching and caching
- 📚 **Storybook** - Component development and documentation
- 🌓 **Dark Mode** - Built-in light/dark theme switching
- 📱 **Responsive** - Mobile-first design approach
- 🐳 **Docker** - Production-ready containerization
- 💅 **Prettier** - Code formatting
- 🔍 **ESLint** - Code linting
- 🎯 **Poppins Font** - Modern, clean typography
- 🏗️ **Enterprise Structure** - Scalable folder organization

## 📦 Tech Stack

- **Framework:** Next.js 16
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Theme:** next-themes
- **Data Fetching:** TanStack Query (React Query)
- **Component Documentation:** Storybook
- **Package Manager:** Bun
- **Container:** Docker

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun 1.0+
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository:**

\`\`\`bash
git clone <your-repo-url>
cd nextshad-boilerplate
\`\`\`

2. **Install dependencies:**

\`\`\`bash
bun install

# or

npm install
\`\`\`

3. **Run the development server:**

\`\`\`bash
bun dev

# or

npm run dev
\`\`\`

4. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Storybook

Storybook is included for component development and documentation.

### Run Storybook

```bash
bun run storybook
```

This will open Storybook at [http://localhost:6006](http://localhost:6006)

### Features Included in Storybook

- ✅ All shadcn/ui components documented
- ✅ Typography showcase with Poppins font
- ✅ Color palette documentation
- ✅ Light/Dark mode preview
- ✅ Interactive controls for component props

### Build Storybook for Production

```bash
bun run build-storybook
```

This generates a static site in the `storybook-static` directory that you can deploy.

## 📁 Project Structure

\`\`\`
nextshad-boilerplate/
├── src/
│ ├── app/ # Next.js app router
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Home page
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── ui/ # shadcn/ui components
│ │ ├── features/ # Feature-specific components
│ │ ├── layouts/ # Layout components
│ │ └── providers/ # Context providers
│ ├── hooks/ # Custom React hooks
│ ├── lib/
│ │ ├── utils.ts # Utility functions
│ │ ├── api/ # API utilities
│ │ └── config/ # Configuration files
│ ├── types/ # TypeScript type definitions
│ └── constants/ # Application constants
├── public/ # Static assets
├── .prettierrc # Prettier configuration
├── components.json # shadcn/ui configuration
├── tailwind.config.ts # Tailwind configuration
├── tsconfig.json # TypeScript configuration
├── Dockerfile # Docker configuration
├── docker-compose.yml # Docker Compose configuration
└── package.json # Dependencies and scripts
\`\`\`

## 🎨 Components Included

The boilerplate includes the following shadcn/ui components:

- ✅ Button
- ✅ Input
- ✅ Textarea
- ✅ Switch
- ✅ Label
- ✅ Alert
- ✅ Sheet
- ✅ Skeleton
- ✅ Sonner (Toast notifications)

### Adding More Components

To add more shadcn/ui components:

\`\`\`bash
bunx shadcn@latest add <component-name>

# or

npx shadcn@latest add <component-name>
\`\`\`

Example:

\`\`\`bash
bunx shadcn@latest add dialog card
\`\`\`

## 🎯 Available Scripts

```bash
# Development
bun dev              # Start development server
bun build            # Build for production
bun start            # Start production server

# Storybook
bun run storybook    # Start Storybook dev server
bun run build-storybook  # Build Storybook for production

# Code Quality
bun run lint         # Run ESLint
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
bun run type-check   # TypeScript type checking

# Docker
bun run docker:build # Build Docker image
bun run docker:run   # Run Docker container
bun run docker:up    # Start with docker-compose
bun run docker:down  # Stop docker-compose
```

## 🐳 Docker Usage

### Building the Docker Image

\`\`\`bash
docker build -t nextshad-boilerplate .
\`\`\`

### Running the Container

\`\`\`bash
docker run -p 3000:3000 nextshad-boilerplate
\`\`\`

### Using Docker Compose

\`\`\`bash

# Start the application

docker-compose up -d

# Stop the application

docker-compose down
\`\`\`

The application will be available at [http://localhost:3000](http://localhost:3000)

### ⚠️ Important: Development vs Production with Docker

**For Development (Recommended):**

```bash
# Use regular bun commands - faster, with hot reload
bun dev
```

**For Production Testing/Deployment:**

```bash
# Use Docker to test production builds
docker-compose up -d
```

**Key Points:**

- ✅ Use `bun dev` for daily development (faster, hot reload)
- ✅ Use Docker for production testing and deployment
- ❌ Don't use Docker for active development (slower, no hot reload)

## 🔮 TanStack Query (React Query)

This boilerplate includes TanStack Query for powerful data fetching, caching, and state management.

### Basic Usage

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => api.get("/posts"),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render your data */}</div>;
}
```

### Custom Hooks

Example custom hooks are provided in `src/hooks/use-query-hooks.ts`:

```tsx
import { usePosts, useCreatePost } from "@/hooks/use-query-hooks";

export function PostsList() {
  const { data: posts } = usePosts();
  const createPost = useCreatePost();

  const handleCreate = () => {
    createPost.mutate({
      title: "New Post",
      content: "Post content",
    });
  };

  return (
    // Your component
  );
}
```

### Features Included

- ✅ Automatic caching and refetching
- ✅ Optimistic updates
- ✅ Query invalidation
- ✅ Pre-configured with sensible defaults
- ✅ Example hooks for common patterns

For more information, check the [TanStack Query Documentation](https://tanstack.com/query/latest)

## 🌓 Theme Switching

The boilerplate includes a built-in theme switcher component. To use it:

\`\`\`tsx
import { ThemeSwitcher } from "@/components/features/theme-switcher";

export default function MyComponent() {
return (

<div>
<ThemeSwitcher />
</div>
);
}
\`\`\`

## 🎨 Customizing Theme

### Colors

Edit the color variables in \`src/app/globals.css\`:

\`\`\`css
:root {
--background: 0 0% 100%;
--foreground: 240 10% 3.9%;
--primary: 240 5.9% 10%;
/_ ... more colors _/
}
\`\`\`

### Fonts

The default font is Poppins. To change it, edit \`src/app/layout.tsx\`:

\`\`\`tsx
import { YourFont } from "next/font/google";

const yourFont = YourFont({
variable: "--font-your-font",
subsets: ["latin"],
weight: ["300", "400", "500", "600", "700"],
});
\`\`\`

## 📝 Environment Variables

Create a \`.env.local\` file in the root directory:

\`\`\`env
NEXT_PUBLIC_APP_NAME="Your App Name"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="/api"
\`\`\`

## 🔧 Configuration Files

### Prettier

Edit \`.prettierrc\` to customize code formatting:

\`\`\`json
{
"semi": true,
"trailingComma": "es5",
"singleQuote": false,
"printWidth": 80,
"tabWidth": 2
}
\`\`\`

### Tailwind

Edit \`tailwind.config.ts\` to customize your design system:

\`\`\`typescript
theme: {
extend: {
colors: {
// Your custom colors
},
},
}
\`\`\`

**Quick Summary:**

## 📚 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Docker Documentation](https://docs.docker.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- [shadcn](https://twitter.com/shadcn) for the amazing UI components
- [Vercel](https://vercel.com) for Next.js
- The open-source community

---

**Happy coding! 🎉**

If you find this boilerplate helpful, please give it a ⭐ on GitHub!
