# Rangsit Social
### Modern Campus Social Media Platform

A production-style university social media web app built with Next.js 15, React 19, MySQL, Tailwind CSS, and JWT auth.

## Stack
- Next.js 15 (App Router)
- React 19
- JavaScript
- Tailwind CSS
- MySQL-compatible database with `mysql2`
- JWT authentication with `bcryptjs`
- Cloudinary media storage
- Vercel deployment

## Features
- Signup, login, logout, protected routes, and profile onboarding
- Responsive campus feed with pagination and optimistic interactions
- Create, edit, delete, like, comment on, save, and share posts
- Image and video uploads through Cloudinary
- Profiles, profile editing, followers, following, and user discovery
- Search for users, posts, and campus topics
- Notifications, appearance preferences, accessibility preferences, and dark mode
- Loading skeletons, empty states, error recovery, and responsive navigation

## Local Setup
1. Use Node.js 22.
2. Install dependencies with `npm install`.
3. Create `.env.local` from `.env.local.example`.
4. Create the database and run `schema.sql`.
5. Optionally run `seed.sql` to add demonstration data.
6. Start the app with `npm run dev`.

The local application is available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=3306
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Never commit `.env.local` or production credentials.

## Scripts
- `npm run dev` starts the development server.
- `npm run build` creates and validates the production build.
- `npm run start` runs the completed production build.

## Deployment

The app is designed for Vercel with TiDB or another MySQL-compatible database and Cloudinary.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables from `.env.local.example`.
4. Set `NEXT_PUBLIC_APP_URL` to the production URL.
5. Deploy the `main` branch.

## Notes
- Profile onboarding is required before creating posts or interacting.
- Media uploads use multipart/form-data and store Cloudinary URLs in MySQL.
- Existing databases should run migration files from `migrations/` once when applicable.
- Personalized API responses use private, non-cached requests to prevent stale account data.
