# Agri Tracker Website

Agri Tracker Website is a modern Next.js application for managing farm-related financial activity. It supports user registration, authentication, transaction tracking, and profile management in a clean dashboard experience.

## Overview

This project helps users record and organize agricultural income and expenses, with a focus on simple workflows for:

- creating and viewing transactions
- separating income and expense entries
- managing user profiles
- navigating between authentication and dashboard pages

## Key Features

- User registration and login flow
- JWT-based authentication with persisted session data
- Transaction entry for income and expenses
- Dashboard-oriented transaction experience
- Profile management pages
- Responsive UI powered by Tailwind CSS and shadcn/ui components
- Prisma + MongoDB persistence layer

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Prisma
- MongoDB
- Tailwind CSS
- shadcn/ui
- bcryptjs
- jsonwebtoken
- lucide-react

## Project Structure

- app/(frontend)/login/page.tsx - login page
- app/(frontend)/register/page.tsx - registration page
- app/(frontend)/dashboard/page.tsx - dashboard entry point
- app/(frontend)/transaction/page.tsx - transaction form experience
- app/(frontend)/profile/page.tsx - profile page
- app/api/login/route.ts - login API route
- app/api/register/route.ts - registration API route
- app/api/transaction/route.ts - transaction API route
- app/services/user.ts - user-related service functions
- app/services/transaction.ts - transaction-related service functions
- prisma/schema.prisma - Prisma schema for MongoDB

## Prerequisites

Before running the app, make sure you have:

- Node.js 20+
- pnpm
- A MongoDB instance or Atlas connection string

## Environment Variables

Create a .env file in the project root with the following values:

```env
DATABASE_URL="mongodb://<username>:<password>@<host>:<port>/<database>"
JWT_SECRET="your-secret-key"
```

## Getting Started

Install dependencies:

```bash
pnpm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Push the schema to your MongoDB database:

```bash
npx prisma db push
```

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

- pnpm dev - start the development server
- pnpm build - create a production build
- pnpm start - run the production build locally
- pnpm lint - run ESLint checks

## Notes

- Authentication data such as the user token and user ID are stored in browser storage after login or registration.
- The Prisma schema is configured for MongoDB and expects DATABASE_URL to point to a valid MongoDB connection string.
- The app is still evolving, and future improvements may include stronger route protection, richer transaction analytics, reports generation, and better form validation.
