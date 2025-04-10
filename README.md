# eBuddy Monorepo

This Turborepo includes the following:

## What's inside?

This Turborepo includes the following packages/apps:

### Apps

- `backend-repo`: an [Express.js](https://expressjs.com/) app with Firebase integration
- `frontend-repo`: a [Next.js](https://nextjs.org/) app with React MUI and Firebase authentication

### Packages

- `@ebuddy/shared-types`: Shared TypeScript interfaces used across both frontend and backend

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
npm run dev
```

### Start

To start all apps after building:

```
npm run start
```

This will start the backend API and frontend server.

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel.

## Project Structure

```
ebuddy-monorepo/
├── apps/
│   ├── backend-repo/      # Express.js backend
│   └── frontend-repo/     # Next.js frontend
├── packages/
│   └── shared-types/      # Shared TypeScript interfaces
├── turbo.json             # Turborepo configuration
└── package.json           # Root package.json for the monorepo
```

## Using the Shared Package

The `@ebuddy/shared-types` package is automatically linked to both the frontend and backend apps through the monorepo's workspaces configuration. After building the shared package, the types become available to both apps.

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/docs/reference/configuration)
- [CLI Usage](https://turbo.build/docs/reference/command-line-reference)
