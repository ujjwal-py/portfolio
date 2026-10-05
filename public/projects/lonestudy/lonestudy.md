# LoneStudy

LoneStudy is a modern, gamified Pomodoro and task tracking web application. It features an integrated YouTube music player to help you focus, along with a sleek glassmorphism UI built with React and TailwindCSS.

## Features

- **Pomodoro Timer**: Classic 25-minute work / 5-minute break cycles.
- **Task Tracking**: Create tasks and assign how many focus cycles you need. The timer automatically logs time and cycles against your active tasks.
- **Integrated Music Player**: A built-in YouTube player with custom lofi and ambient track playlists to help you focus without switching tabs.
- **Stats Dashboard**: A beautiful user profile tracking your daily, weekly, and monthly productivity, total hours focused, and tasks completed.
- **Authentication**: JWT-based secure user authentication.

## Tech Stack

- **Frontend**: React (Vite), TailwindCSS, React-Router, React-Youtube.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Zod.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/your-username/lonestudy.git
cd lonestudy
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory (see `.env.example`):

```env
PORT=5000
SECRET_KEY=your_secret_key_here
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/lonestudy  # or your MongoDB Atlas URI
```

Start the backend server:

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory (see `.env.example`):

```env
VITE_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

---

## Deployment Guide

### Backend (e.g. Render, Heroku, Railway)

1. Set the Node environment to `production`.
2. Configure the following environment variables in your hosting provider's dashboard:
   - `PORT`: (Usually assigned automatically by the host)
   - `SECRET_KEY`: A secure random string for JWT signing
   - `FRONTEND_URL`: The deployed URL of your frontend (e.g., `https://lonestudy.vercel.app`)
   - `MONGO_URI`: Your production MongoDB connection string
3. Add the start script to `backend/package.json` if not already present: `"start": "node index.js"`.

### Frontend (e.g. Vercel, Netlify)

1. Connect your GitHub repository to your hosting provider.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the following environment variable to your deployment settings:
   - `VITE_BASE_URL`: The deployed URL of your backend API (e.g., `https://lonestudy-api.onrender.com/api`)
4. Deploy the frontend application.

## License

MIT
