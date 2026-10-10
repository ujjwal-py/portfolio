# Offscript

Offscript is a full-stack social publishing platform built with Next.js. Users can create and manage posts, submit content for moderation, publish approved posts, search content, interact through likes, and manage profiles.

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

## Next.js Features

### App Router

The project uses the Next.js App Router under `src/app/`, including:

- `/`
- `/home`
- `/auth`
- `/profile`
- `/my-posts`
- `/post/[id]`
- `/admin`

Special route files include:

- `page.tsx`
- `layout.tsx`
- `loading.tsx`
- `error.tsx`
- `not-found.tsx`
- `route.ts`

### Server and Client Components

Server Components handle:

- Database queries
- Server-side authentication
- Home feed rendering
- Profile and post data
- Admin moderation data
- Search and pagination

Client Components handle:

- Authentication forms
- Theme switching
- Navigation and mobile sidebar interactions
- Like/unlike actions
- Post forms
- Dialogs
- Toast notifications
- Optimistic UI updates

### Route Handlers

Backend APIs are implemented with Next.js Route Handlers under `src/app/v1/` using `GET`, `POST`, `PUT`, and `DELETE`.

### API Routes

| Method | Endpoint                     | Authentication |
| ------ | ---------------------------- | -------------- |
| GET    | `/v1`                        | Public         |
| POST   | `/v1/signup`                 | Public         |
| POST   | `/v1/signin`                 | Public         |
| GET    | `/v1/me`                     | Required       |
| POST   | `/v1/logout`                 | Required       |
| GET    | `/v1/posts`                  | Public         |
| GET    | `/v1/posts/:id`              | Public         |
| POST   | `/v1/post`                   | Required       |
| PUT    | `/v1/posts/:id`              | Required       |
| DELETE | `/v1/post/:id`               | Required       |
| GET    | `/v1/user/posts/unpublished` | Required       |
| GET    | `/v1/user/posts/published`   | Required       |
| GET    | `/v1/search/posts`           | Public         |
| GET    | `/v1/user/search/posts`      | Required       |
| POST   | `/v1/posts/:id/like`         | Required       |
| DELETE | `/v1/posts/:id/dislike`      | Required       |
| GET    | `/v1/admin/posts/pending`    | Admin          |
| PUT    | `/v1/admin/posts/:id/status` | Admin          |
| DELETE | `/v1/admin/posts/:id`        | Admin          |

### Dynamic Routes

Dynamic segments support individual post pages and post-specific API operations:

- `src/app/post/[id]/page.tsx`
- `src/app/v1/post/[id]/route.ts`
- `src/app/v1/posts/[id]/route.ts`
- `src/app/v1/admin/posts/[id]/route.ts`

### Loading and Error Boundaries

Route-level `loading.tsx` files provide loading UI while server content is rendered. Global error and 404 handling are implemented with `error.tsx` and `not-found.tsx`.

### Proxy Route Protection

`src/proxy.ts` protects `/profile`, `/my-posts`, and `/admin` by redirecting requests without an authentication cookie to `/auth`. Server-side JWT and role validation remains authoritative.

### Metadata, Fonts, and Images

- Next.js Metadata API provides page titles and descriptions.
- `next/font/google` loads the Share Tech font.
- `next/image` provides optimized responsive post images.
- Typed route props use types such as `PageProps` and `LayoutProps`.
- URL search parameters drive search, sorting, and pagination.
- Turbopack supports fast local development.

## Authentication and Authorization

### JWT Authentication

JWTs are generated with `jose` and contain:

```ts
{
  user_id: string;
  role: "USER" | "ADMIN";
}
```

Tokens expire after 24 hours and are stored in the `jwt_token` HTTP-only cookie with `sameSite` protection and production `secure` settings.

The authentication flow is:

```text
Credentials
  -> POST /v1/signin or /v1/signup
  -> Zod validation
  -> bcrypt credential verification or user creation
  -> JWT generation
  -> HTTP-only cookie
  -> router.refresh()
  -> getAuthUser()
  -> Prisma user lookup
  -> UserProvider
  -> client components
```

`getAuthUser()` reads and verifies the cookie, extracts the user ID, and loads the user from PostgreSQL. `requireAuthUser()` and `requireAdminUser()` independently protect API operations.

### User Context

The server-loaded user is passed from the root layout to `UserProvider`. Client components access it with `useUser()`.

The context is used by:

- The navbar for authenticated and admin navigation
- The mobile sidebar for user-specific links
- The like button for current-user like state and sign-in prompts

The context is for UI access only; server-side JWT verification is the security boundary.

## Backend Features

### Prisma and PostgreSQL

Prisma 7 provides database access through the PostgreSQL adapter. The schema contains:

- `User`: identity, password hash, role, and timestamps
- `Posts`: title, description, author, image URL, status, and timestamps
- `Likes`: user/post relationships with duplicate prevention

Relationships include:

```text
User 1 ---- many Posts
User 1 ---- many Likes
Posts 1 ---- many Likes
```

The database uses Prisma migrations for schema evolution, including roles, post statuses, images, timestamps, and likes.

### Password Security

`bcryptjs` hashes passwords during signup and compares hashes during signin. Plaintext passwords and password hashes are never returned to clients.

### Post Lifecycle

```text
DRAFT -> PENDING -> PUBLISHED
                  -> REJECTED
                  -> REMOVED
```

Ownership checks ensure users can only edit or delete their own posts. Admins can review pending content, approve or reject submissions, and remove published posts.

### Validation and Errors

Zod validates user, post, status, like, and query parameters before database operations. Centralized custom errors provide consistent HTTP statuses, messages, and error codes.

### Search and Pagination

The backend supports title search for public posts, user posts, and admin content. Results support:

- Sorting by likes
- Sorting by last updated time
- Ascending and descending order
- URL-driven pagination
- Nine posts per home feed page

### Likes and Optimistic UI

Authenticated users can like and unlike published posts. Backend authentication, post validation, and the database constraint `@@unique([userId, postId])` prevent invalid or duplicate likes.

Zustand stores client-side like state so the UI updates immediately while the server remains the source of truth.

### Supabase Storage

Supabase Storage handles post images with:

- JPEG, PNG, and WebP validation
- A 5 MB upload limit
- Server-side upload handling
- Image URL persistence
- Replacement-image cleanup
- Rollback cleanup when database writes fail

Sensitive Supabase credentials remain server-side.

## UI and UX

- Tailwind CSS v4 provides responsive styling.
- Base UI and shadcn-style components provide accessible controls.
- Sonner provides success and error toast notifications.
- Lucide React provides interface icons.
- `next-themes` manages dark mode and the warm cream light theme.
- Responsive navigation includes desktop links and a mobile dialog sidebar.
- Post cards include optimized images, titles, dates, descriptions, and like counts.

## Technology Stack

| Technology           | Purpose                       |
| -------------------- | ----------------------------- |
| Next.js 16           | Full-stack React framework    |
| React 19             | UI and Server Components      |
| TypeScript           | Static typing                 |
| Tailwind CSS v4      | Styling and responsive design |
| Base UI              | Accessible UI primitives      |
| Prisma 7             | Database ORM                  |
| PostgreSQL           | Relational database           |
| `@prisma/adapter-pg` | PostgreSQL driver adapter     |
| `jose`               | JWT signing and verification  |
| `bcryptjs`           | Password hashing              |
| Zod                  | Request validation            |
| Supabase Storage     | Image storage                 |
| Zustand              | Client-side optimistic state  |
| `next-themes`        | Theme management              |
| Sonner               | Toast notifications           |
| Lucide React         | Icons                         |

## Project Structure

```text
offscript-next/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── my-posts/
│   │   ├── post/[id]/
│   │   ├── profile/
│   │   ├── v1/
│   │   ├── error.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── loading.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── auth-form.tsx
│   │   ├── navbar.tsx
│   │   ├── post-card.tsx
│   │   ├── post-form.tsx
│   │   ├── like-button.tsx
│   │   └── user-provider.tsx
│   ├── hooks/
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   ├── errors.ts
│   │   ├── prisma.ts
│   │   ├── route-utils.ts
│   │   ├── validation.ts
│   │   └── services/
│   ├── store/
│   │   └── like-store.ts
│   └── proxy.ts
├── next.config.ts
├── prisma.config.ts
├── package.json
└── tsconfig.json
```

## Security Model

- JWTs are stored in HTTP-only cookies.
- Client context is used for UI state, not authorization.
- Server Components validate authentication before rendering protected content.
- API routes independently verify JWTs.
- Admin routes verify the `ADMIN` role.
- Ownership checks prevent unauthorized post operations.
- Passwords are stored using bcrypt hashes.
- Sensitive database, JWT, and Supabase credentials remain server-side.
- Zod validation rejects malformed input before database operations.
