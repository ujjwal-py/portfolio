export type ReadmeSection = { heading: string; body: string; items?: string[] };

export type Project = {
  number: string;
  title: string;
  kicker: string;
  readmeUrl?: string;
  screenshots: string[];
  github?: string;
  live?: string;
  accent: "blue" | "yellow" | "black";
};

// Add a project by supplying its README path, screenshot paths, and links.
// The renderer only shows information that exists in the README.
export const projects: Project[] = [
  {
    number: "01",
    title: "OFFSCRIPT",
    kicker: "A blogging and social publishing platform",
    readmeUrl: "/projects/offscript/offscript.md",
    live: "https://offscript-next.vercel.app/",
    github: "https://github.com/ujjwal-py/offscript-next",
    screenshots: [
      "/projects/offscript/home.png",
      "/projects/offscript/my-posts.png",
      "/projects/offscript/profile.png",
      "/projects/offscript/admin.png",

    ],
    accent: "blue",
  },
  {
    number: "02",
    title: "LONESTUDY",
    kicker: "a gamified Pomodoro and task-tracking app with YouTube music",
    readmeUrl: "/projects/lonestudy/lonestudy.md",
    github: "https://github.com/ujjwal-py/LoneStudyV2",
    live: "https://lonestudy.vercel.app/",
    screenshots: [
      "/projects/lonestudy/lonestudy.vercel.app_.png",
      "/projects/lonestudy/lonestudy.vercel.app_focus.png",
      "/projects/lonestudy/lonestudy.vercel.app_todo.png",
      "/projects/lonestudy/lonestudy.vercel.app_settings.png",
      "/projects/lonestudy/lonestudy.vercel.app_profile.png"
    ],
    accent: "yellow",
  },
  {
    number: "03",
    title: "HAWKWATCH",
    kicker: "README / AWAITING PROJECT CONTENT",
    readmeUrl: "/projects/hawkwatch/hawkwatch.md",
    screenshots: [
      "/projects/hawkwatch/landing.gif",
      "projects/hawkwatch/gallary.gif"
    ],
    accent: "black",
  },
];

export const stack = {
  FRONTEND: ["React", "Next.js", "Javascript", "TypeScript", "Tailwind CSS"],
  BACKEND: ["Node.js", "Express", "FastAPI"],
  DATABASE: ["PostgreSQL", "MongoDB", "Supabase"],
  LANGUAGES: ["JavaScript", "Java", "Python", "C++"],
  TOOLS: ["Git", "Docker", "Linux", "Nginx", "Microsoft Azure"],
};

// The resume PDF lives in /public. Update `file` if the document is renamed.
export const resume = {
  file: "/resume.pdf",
  fileName: "Ujjwal_Kumar_Resume.pdf",
  updated: "OCT 2026",
  pages: "01",
};

export const buildLog = [
  ["01", "LEARNING", "DSA + system design"],
  ["02", "BUILDING", "Useful software, one release at a time"],
  ["03", "EXPLORING", "Web / backend / AI"],
  ["04", "STATUS", "Open to interesting problems"],
];
