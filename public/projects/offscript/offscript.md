# Offscript

Offscript is a fullstack blogging and social publishing platform built with React, TypeScript, Express, Prisma, PostgreSQL, and Supabase. Users can create drafts, submit posts for moderation, manage published content, search and like public posts, upload images, and authenticate securely with JWT cookies. Administrators can review pending submissions, approve or reject content, and remove published posts when necessary.

## Project structure

```text
offscript/
├── client/                 # React + Vite frontend
│   ├── src/components/     # Reusable UI components
│   ├── src/pages/          # Route-level pages
│   ├── src/hooks/          # Custom React hooks
│   ├── src/store/          # Zustand stores
│   └── vercel.json         # SPA route fallback for Vercel
├── server/                 # Express + Prisma backend
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/routes/         # API route definitions and controllers
│   ├── src/middlewares/    # Authentication, validation, and uploads
│   ├── src/lib/            # Prisma and Supabase clients
│   └── .env.example        # Backend environment variable template
└── README.md
```

## Features

### Authentication and authorization

- User signup, signin, logout, and current-user verification
- JWT authentication stored in an HTTP-only cookie
- Cross-origin credential support for the Vercel frontend and Render backend
- Protected routes for authenticated users
- Role-based authorization with `USER` and `ADMIN` roles
- Admin-only dashboard and moderation endpoints
- Password hashing with bcrypt

### Post creation and lifecycle

- Create posts with a title, description, and optional image
- Edit posts owned by the current user
- Delete user-owned posts
- Save posts as `DRAFT`
- Submit posts for moderation as `PENDING`
- Admin moderation statuses: `PUBLISHED`, `REJECTED`, and `REMOVED`
- Status badges on draft, pending, and published post cards
- Author information displayed with public posts
- Post ownership enforced by authenticated backend routes

### Admin moderation

- Dedicated admin dashboard at `/admin`
- View all pending posts submitted by users
- Open posts in a full-screen dialogue to inspect the complete content
- Approve pending posts and change their status to `PUBLISHED`
- Reject pending posts and change their status to `REJECTED`
- Search published public posts by title
- Remove published posts by changing their status to `REMOVED`
- Admin actions protected by both frontend route guards and backend role checks

### Search, sorting, and pagination

- Search public posts by title
- Search the current user's published posts by title
- Debounced search input
- Sort posts by likes or last updated time
- Sort results in ascending or descending order
- Paginated home feed
- Empty states for no posts, no drafts, and no search results

### Likes and interactions

- Like published posts
- Unlike posts that the current user has already liked
- Like counts displayed on post cards
- Immediate like and unlike UI updates through Zustand state
- Unauthenticated like attempts show a sign-in prompt
- Duplicate likes are prevented on the backend

### Media and validation

- Image uploads handled with Multer
- Images stored in Supabase Storage
- JPEG, PNG, and WebP file validation
- Five-megabyte upload size limit
- Request validation with Zod
- Centralized backend custom errors and error codes
- Centralized Axios error toasts for API and network failures

### User interface

- Chakra UI component-based interface
- Tailwind CSS utility classes for layout and responsive grids
- Responsive desktop and mobile layouts
- Dark and light theme switching
- Chakra loading screens with contextual messages
- Chakra toast notifications for success, API, and network errors
- Full-screen post dialogues for viewing, editing, and moderation

## Tech stack

### Frontend

| Technology       | Purpose                                  |
| ---------------- | ---------------------------------------- |
| React            | UI library                               |
| React DOM        | React browser rendering                  |
| TypeScript       | Static typing                            |
| Vite             | Development server and build tool        |
| Chakra UI        | Component library and responsive styling |
| Tailwind CSS     | Utility-first CSS                        |
| React Router DOM | Client-side routing                      |
| Zustand          | Global state management                  |
| Axios            | HTTP requests                            |
| React Icons      | Icons                                    |

### Backend

| Technology           | Version         | Purpose                           |
| -------------------- | --------------- | --------------------------------- |
| Node.js              | LTS recommended | JavaScript runtime                |
| Express              | `^5.2.1`        | HTTP server and API routing       |
| TypeScript           | `^7.0.2`        | Static typing and compilation     |
| Prisma               | `^7.9.1`        | ORM and generated database client |
| PostgreSQL           | Supabase-hosted | Relational database               |
| `@prisma/adapter-pg` | `^7.9.1`        | Prisma PostgreSQL adapter         |
| Supabase JS          | `^2.116.0`      | Supabase Storage integration      |
| JSON Web Token       | `^9.0.3`        | JWT creation and verification     |
| bcrypt               | `^6.0.0`        | Password hashing                  |
| cookie-parser        | `^1.4.7`        | Authentication cookie parsing     |
| cors                 | `^2.8.6`        | Cross-origin frontend access      |
| Zod                  | `^4.5.4`        | Request validation                |
| Multer               | `^2.3.0`        | Multipart image uploads           |
| tsx                  | `^4.23.12`      | Running TypeScript directly       |

## Prerequisites

- Node.js 20+ recommended
- npm
- A PostgreSQL database, such as Supabase Postgres
- A Supabase project if image storage is enabled

## Local setup

```bash
git clone https://github.com/ujjwal-py/typescript-social-media.git
cd offscript

cd server
npm install --include=dev

cd ../client
npm install
```

The server's `postinstall` script runs `prisma generate` automatically. The generated Prisma client is placed under `server/src/generated/prisma` and is not committed to Git.

## Backend environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=3000
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
NODE_ENV="development"
FRONTEND_URL="http://localhost:5173"
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-server-side-service-role-key"
SUPABASE_BUCKET="your-storage-bucket-name"
```

Never expose `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`, or `JWT_SECRET` in frontend code or commit them to Git.

## Frontend environment variables

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:3000
```

The Axios client automatically appends `/v1`, so the value should not include `/v1`.

## Run locally

Open two terminals.

### Backend

```bash
cd server
npm run dev
```

The API runs on `http://localhost:3000` by default.

### Frontend

```bash
cd client
npm run dev
```

The Vite development server runs on `http://localhost:5173` by default.

## Available scripts

### Frontend

```bash
npm run dev       # Start Vite development server
npm run build     # Type-check and create production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build locally
```

### Backend

```bash
npm run dev       # Start nodemon with tsx
npm run build     # TypeScript build/type-check
npm start         # Start the server with tsx
npm test          # Placeholder test script
```

## Database and Prisma

The Prisma schema is located at `server/prisma/schema.prisma`.

```bash
cd server
npx prisma generate
npx prisma migrate dev --name describe-your-change
npx prisma migrate deploy
```

Use `migrate dev` for local schema changes. Use `migrate deploy` in production after migrations have been committed. The `postinstall` script only runs `prisma generate`; it does not modify database tables or data.

## API routes

The API is mounted under `/v1`.

### Authentication

| Method | Route        | Auth     |
| ------ | ------------ | -------- |
| `POST` | `/v1/signup` | Public   |
| `POST` | `/v1/signin` | Public   |
| `GET`  | `/v1/me`     | Required |
| `POST` | `/v1/logout` | Required |

### Posts

| Method   | Route              | Auth     |
| -------- | ------------------ | -------- |
| `GET`    | `/v1/posts`        | Public   |
| `GET`    | `/v1/public-posts` | Public   |
| `GET`    | `/v1/unpublished`  | Required |
| `GET`    | `/v1/published`    | Required |
| `GET`    | `/v1/user-posts`   | Required |
| `POST`   | `/v1/post`         | Required |
| `PUT`    | `/v1/post/:id`     | Required |
| `DELETE` | `/v1/post/:id`     | Required |
| `POST`   | `/v1/like/:id`     | Required |
| `DELETE` | `/v1/dislike/:id`  | Required |

### Admin

| Method   | Route                 |
| -------- | --------------------- |
| `DELETE` | `/v1/post-admin/:id`  |
| `PUT`    | `/v1/post-status/:id` |
| `GET`    | `/v1//pending-posts`  |

---

Built with care by [Ujjwal](https://github.com/ujjwal-py) · [View more projects on GitHub](https://github.com/ujjwal-py)
