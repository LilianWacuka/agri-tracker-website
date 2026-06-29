# Agri Tracker Website

A Next.js 16 + TypeScript app for managing agricultural transactions, user authentication, and basic income/expense tracking. The project uses Prisma with MongoDB for persistence and a lightweight shadcn/Tailwind UI design.

## Features

- User registration and login
- JWT-based authentication
- Transaction CRUD via `/api/transaction`
- Separate income and expense transaction flows
- MongoDB backend with Prisma client
- Client-side pages for register, login, and dashboard
- Responsive UI built with Tailwind and shadcn components

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Prisma
- MongoDB
- Tailwind CSS
- shadcn/ui components
- bcryptjs
- jsonwebtoken
- lucide-react

## File structure highlights

- `app/(frontend)/register/page.tsx` - registration form and flow
- `app/(frontend)/login/page.tsx` - login form and flow
- `app/(frontend)/dashboard/page.tsx` - dashboard wrapper for transaction pages
- `app/(frontend)/transaction/page.tsx` - transaction input forms
- `app/api/register/route.ts` - registration API route
- `app/api/login/route.ts` - login API route
- `app/api/transaction/route.ts` - transaction API route
- `app/services/user.ts` - user service functions
- `app/services/transaction.ts` - transaction service functions
- `prisma/schema.prisma` - MongoDB schema definitions

## Environment variables

Create a `.env` file at the project root with:

```env
DATABASE_URL="<your MongoDB connection string>"
JWT_SECRET="your_jwt_secret"
```

## Getting started

```bash
pnpm install
npx prisma generate
npx prisma db push
pnpm dev
```

Then open `http://localhost:3000`.

## Available scripts

- `pnpm dev` - start the Next.js development server
- `pnpm build` - build the production app
- `pnpm start` - run the built app
- `pnpm lint` - run ESLint

## Notes

- The app stores `token` and `userId` in `localStorage` after login/registration.
- The Prisma schema is configured for MongoDB and expects `DATABASE_URL` to point to a MongoDB database.
- The home page currently renders the registration flow by default.

## Next steps

- Add protected route handling for pages like `/dashboard`
- Add transaction editing and deletion UI controls
- Add better error feedback and form validation
- Add summary charts or totals for income/expense tracking
