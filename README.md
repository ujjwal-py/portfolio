# Ujjwal — Developer Lab

Personal portfolio site for Ujjwal, a computer science student and full-stack developer. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Interactive hero terminal with `help`, `about`, `projects`, `contact`, and `clear` commands.
- Project case studies rendered from Markdown files in `public/projects`.
- Live Build Log showing the four latest public commits from GitHub.
- Responsive portfolio layout with custom 404 and error pages.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run build
npm start
```

## GitHub commit feed

`app/api/github-commits/route.ts` requests recent commits authored by `ujjwal-py` using the GitHub REST API. Results are cached for five minutes to avoid unnecessary API requests. The client refreshes its displayed result every five minutes.

## Deploy on Vercel

Import this repository into Vercel and use the default settings. `vercel.json` marks this as a Next.js deployment so Vercel serves App Router pages and the `/api/github-commits` route through Next.js routing. No catch-all rewrite is used, allowing missing pages to reach the custom 404 screen.

## Project structure

```text
app/
  api/github-commits/route.ts  GitHub commit feed
  error.tsx                    Route error boundary
  not-found.tsx                Custom 404 page
  page.tsx                     Portfolio page
public/projects/               Project Markdown case studies
```
