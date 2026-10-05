"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildLog, Project, projects, stack } from "./data";

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span className="arrow" aria-hidden="true">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

type TerminalEntry = { command?: string; lines: React.ReactNode[] };
type RecentCommit = { repository: string; message: string; url: string; timestamp: string };

function HeroTerminal() {
  const [command, setCommand] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([
    { lines: ["UJJWAL.DEV // PORTFOLIO SHELL", "Booting interface..."] },
  ]);
  const [isBooted, setIsBooted] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [entries]);

  useEffect(() => {
    const bootLines = ["Loading developer profile... OK", "Connecting project archive... OK", "System initialized. Type `help` to see available commands."];
    const timers = bootLines.map((line, index) => window.setTimeout(() => {
      setEntries((current) => [...current, { lines: [line] }]);
      if (index === bootLines.length - 1) setIsBooted(true);
    }, (index + 1) * 500));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  function runCommand(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = command.trim();
    if (!value) return;
    const normalized = value.toLowerCase();
    let lines: React.ReactNode[];
    if (normalized === "clear") {
      setEntries([]);
      setCommand("");
      return;
    } else if (normalized === "help") {
      lines = ["Available commands:", "help  about  projects  contact  clear"];
    } else if (normalized === "about") {
      lines = ["Ujjwal is a computer science student and full-stack developer", "building useful software and exploring web, backend, and AI."];
    } else if (normalized === "projects") {
      lines = projects.map((project) => `• ${project.title}`);
    } else if (normalized === "contact") {
      lines = [
        <a key="github" href="https://github.com/ujjwal-py" target="_blank" rel="noreferrer">GitHub ↗</a>,
        <a key="linkedin" href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn ↗</a>,
        <a key="email" href="mailto:hello@ujjwal.dev">hello@ujjwal.dev ↗</a>,
      ];
    } else {
      lines = [`Command not found: ${value}`, "Type `help` to see available commands."];
    }
    setEntries((current) => [...current, { command: value, lines }]);
    setCommand("");
  }

  return (
    <div className="hero-terminal" aria-label="Interactive portfolio terminal">
      <div className="hero-terminal-bar">
        <div className="terminal-dots" aria-hidden="true"><i /><i /><i /></div>
        <span>ujjwal@portfolio: ~</span>
        <span className="terminal-live"><i /> ONLINE</span>
      </div>
      <div className="hero-terminal-content" ref={outputRef} aria-live="polite">
        {entries.map((entry, index) => (
          <div className="terminal-entry" key={index}>
            {entry.command && <div className="terminal-command"><span>ujjwal@portfolio:~$</span> {entry.command}</div>}
            {entry.lines.map((line, lineIndex) => <div className="terminal-output" key={lineIndex}>{line}</div>)}
          </div>
        ))}
        <form className="terminal-input-row" onSubmit={runCommand}>
          <label htmlFor="hero-command">ujjwal@portfolio:~$</label>
          <input id="hero-command" value={command} onChange={(event) => setCommand(event.target.value)} autoComplete="off" spellCheck={false} aria-label="Enter a terminal command" disabled={!isBooted} placeholder={isBooted ? "" : "booting..."} />
          <span className="terminal-cursor" aria-hidden="true" />
        </form>
      </div>
      <div className="hero-terminal-footer"><span>TRY: HELP / ABOUT / PROJECTS / CONTACT / CLEAR</span><span>UTF-8</span></div>
    </div>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section-label">
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function LabVisual({
  project,
  compact = false,
}: {
  project: Project;
  compact?: boolean;
}) {
  return (
    <div className={`lab-visual ${project.accent} ${compact ? "compact" : ""}`}>
      <div className="visual-top">
        <span>SCREEN / {project.number}</span>
        <span>◉ REC</span>
      </div>
      <div className="blueprint">
        <div className="blueprint-cross" />
        <div className="blueprint-box box-a" />
        <div className="blueprint-box box-b" />
        <div className="blueprint-line line-a" />
        <div className="blueprint-line line-b" />
        <div className="visual-word">{project.title.split(" ")[0]}</div>
        <span className="coord coord-a">04° 12′ 08″ N</span>
        <span className="coord coord-b">BUILD / 2.6</span>
      </div>
      <div className="visual-bottom">
        <span>UI / SYSTEM</span>
        <span>100%</span>
      </div>
    </div>
  );
}

type ReadmeBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; rows: string[][] }
  | { type: "code"; text: string; language: string };

type ParsedSection = { heading: string; blocks: ReadmeBlock[] };

function parseReadme(readme: string): ParsedSection[] {
  const lines = readme.split("\n");
  const sections: { heading: string; lines: string[] }[] = [];
  let current: { heading: string; lines: string[] } | undefined;
  lines.forEach((line) => {
    const match = line.match(/^#{1,3}\s+(.+)/);
    if (match) {
      current = { heading: match[1].replace(/[*_`]/g, ""), lines: [] };
      sections.push(current);
    } else if (current && line.trim()) current.lines.push(line);
  });
  return sections.map((section) => {
    const blocks: ReadmeBlock[] = [];
    let index = 0;
    while (index < section.lines.length) {
      const line = section.lines[index];
      const codeStart = line.match(/^```(\w*)/);
      if (codeStart) {
        const code: string[] = [];
        index += 1;
        while (
          index < section.lines.length &&
          !section.lines[index].startsWith("```")
        )
          code.push(section.lines[index++]);
        index += 1;
        blocks.push({
          type: "code",
          text: code.join("\n"),
          language: codeStart[1] || "text",
        });
      } else if (
        line.includes("|") &&
        index + 1 < section.lines.length &&
        /^\s*\|?\s*:?-{3,}/.test(section.lines[index + 1])
      ) {
        const rows: string[][] = [];
        while (
          index < section.lines.length &&
          section.lines[index].includes("|")
        ) {
          if (!/^\s*\|?\s*:?-{3,}/.test(section.lines[index]))
            rows.push(
              section.lines[index]
                .split("|")
                .map((cell) => cell.trim())
                .filter(Boolean),
            );
          index += 1;
        }
        blocks.push({ type: "table", rows });
      } else if (/^[-*+]\s+/.test(line)) {
        const items: string[] = [];
        while (
          index < section.lines.length &&
          /^[-*+]\s+/.test(section.lines[index])
        )
          items.push(section.lines[index++].replace(/^[-*+]\s+/, ""));
        blocks.push({ type: "list", items });
      } else {
        const paragraph: string[] = [];
        while (
          index < section.lines.length &&
          section.lines[index].trim() &&
          !/^```/.test(section.lines[index]) &&
          !/^[-*+]\s+/.test(section.lines[index]) &&
          !section.lines[index].includes("|")
        )
          paragraph.push(section.lines[index++]);
        if (paragraph.length)
          blocks.push({ type: "paragraph", text: paragraph.join(" ") });
        else index += 1;
      }
    }
    return { heading: section.heading, blocks };
  });
}

function renderInline(text: string) {
  return text
    .split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .map((token, index) => {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link)
        return (
          <a
            className="readme-link"
            href={link[2]}
            target="_blank"
            rel="noreferrer"
            key={`${token}-${index}`}
          >
            {link[1]} ↗
          </a>
        );
      if (token.startsWith("`") && token.endsWith("`"))
        return <code key={`${token}-${index}`}>{token.slice(1, -1)}</code>;
      if (token.startsWith("**") && token.endsWith("**"))
        return <strong key={`${token}-${index}`}>{token.slice(2, -2)}</strong>;
      if (token.startsWith("*") && token.endsWith("*"))
        return <em key={`${token}-${index}`}>{token.slice(1, -1)}</em>;
      return <span key={`${token}-${index}`}>{token}</span>;
    });
}

function ProjectDialog({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [slide, setSlide] = useState(0);
  const [readme, setReadme] = useState("");
  const [readmeError, setReadmeError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const sections = useMemo(() => parseReadme(readme), [readme]);
  const hasScreenshots = project.screenshots.length > 0;
  const total = Math.max(project.screenshots.length, 1);

  useEffect(() => {
    closeRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setSlide((value) => (value + 1) % total);
      if (event.key === "ArrowLeft")
        setSlide((value) => (value - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, total]);

  useEffect(() => {
    let cancelled = false;
    setReadme("");
    setReadmeError("");
    if (!project.readmeUrl) return;

    fetch(project.readmeUrl)
      .then((response) => {
        if (!response.ok)
          throw new Error(`README request failed with ${response.status}`);
        return response.text();
      })
      .then((content) => {
        if (!cancelled) setReadme(content);
      })
      .catch((error: Error) => {
        if (!cancelled) setReadmeError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [project.readmeUrl]);

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <article
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <header className="dialog-header">
          <div>
            <span className="mono">PROJECT / {project.number}</span>
            <span className="mono">CASE STUDY</span>
          </div>
          <button ref={closeRef} className="close-button" onClick={onClose}>
            × CLOSE
          </button>
        </header>
        <div className="dialog-title-row">
          <div>
            <span className="eyebrow">CASE STUDY / {project.number}</span>
            <h2 id="dialog-title">{project.title}</h2>
          </div>
          <div className="dialog-links">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer">
                [ LIVE PROJECT <Arrow diagonal /> ]
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer">
                [ GITHUB <Arrow diagonal /> ]
              </a>
            )}
          </div>
        </div>
        <div
          className="gallery"
          onTouchStart={(event) => {
            (event.currentTarget as HTMLElement).dataset.startX = String(
              event.touches[0].clientX,
            );
          }}
          onTouchEnd={(event) => {
            const start = Number(
              (event.currentTarget as HTMLElement).dataset.startX,
            );
            const delta = event.changedTouches[0].clientX - start;
            if (Math.abs(delta) > 40)
              setSlide(
                (value) => (value + (delta < 0 ? 1 : -1) + total) % total,
              );
          }}
        >
          {hasScreenshots ? (
            <img
              src={project.screenshots[slide]}
              alt={`${project.title} screenshot ${slide + 1}`}
            />
          ) : (
            <LabVisual project={project} />
          )}
          <div className="gallery-nav">
            <button
              onClick={() => setSlide((value) => (value - 1 + total) % total)}
              aria-label="Previous screenshot"
            >
              ←
            </button>
            <span>
              {String(slide + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </span>
            <button
              onClick={() => setSlide((value) => (value + 1) % total)}
              aria-label="Next screenshot"
            >
              →
            </button>
          </div>
        </div>
        <div className="dialog-body">
          {sections.length ? (
            sections.map((section, sectionIndex) => (
              <section
                className="readme-section"
                key={`${section.heading}-${sectionIndex}`}
              >
                <h3>{section.heading}</h3>
                <div className="readme-content">
                  {section.blocks.map((block, blockIndex) => {
                    if (block.type === "paragraph")
                      return (
                        <p key={`${section.heading}-paragraph-${blockIndex}`}>
                          {renderInline(block.text)}
                        </p>
                      );
                    if (block.type === "list")
                      return (
                        <ul key={`${section.heading}-list-${blockIndex}`}>
                          {block.items.map((item, itemIndex) => (
                            <li key={`${section.heading}-item-${itemIndex}`}>
                              {renderInline(item)}
                            </li>
                          ))}
                        </ul>
                      );
                    if (block.type === "code")
                      return (
                        <pre
                          key={`${section.heading}-code-${blockIndex}`}
                          data-language={block.language}
                        >
                          <code>{block.text}</code>
                        </pre>
                      );
                    return (
                      <div
                        className="readme-table-wrap"
                        key={`${section.heading}-table-${blockIndex}`}
                      >
                        <table>
                          <thead>
                            <tr>
                              {block.rows[0]?.map((cell, cellIndex) => (
                                <th
                                  key={`${section.heading}-head-${cellIndex}`}
                                >
                                  {renderInline(cell)}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {block.rows.slice(1).map((row, rowIndex) => (
                              <tr key={`${section.heading}-row-${rowIndex}`}>
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={`${section.heading}-${rowIndex}-${cellIndex}`}
                                  >
                                    {renderInline(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          ) : (
            <section className="empty-readme">
              <span className="mono">
                README / {readmeError ? "LOAD ERROR" : "CONTENT REQUIRED"}
              </span>
              <p>
                {readmeError || (
                  <>
                    Create the project README at{" "}
                    <code>
                      {project.readmeUrl ||
                        "public/projects/project-name/README.md"}
                    </code>{" "}
                    and add its path to <code>app/data.ts</code>.
                  </>
                )}
              </p>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: () => void;
}) {
  return (
    <article className={`project-card ${project.accent}`}>
      <div className="project-meta">
        <span>{project.number} / SELECTED WORK</span>
        <span>{project.kicker}</span>
      </div>
      <button className="project-trigger" onClick={onOpen}>
        <LabVisual project={project} compact />
        <div className="project-card-footer">
          <h3>{project.title}</h3>
          <span>
            VIEW PROJECT <Arrow />
          </span>
        </div>
      </button>
    </article>
  );
}

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [recentCommits, setRecentCommits] = useState<RecentCommit[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadRecentCommits() {
      try {
        const response = await fetch(
          "/api/github-commits",
        );
        if (!response.ok) throw new Error("GitHub activity request failed");
        const data: { commits: RecentCommit[] } = await response.json();
        const commits = data.commits;
        if (!cancelled) setRecentCommits(commits);
      } catch {
        // The static build log remains visible when GitHub is unreachable or rate-limited.
      }
    }

    loadRecentCommits();
    const refresh = window.setInterval(loadRecentCommits, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      window.clearInterval(refresh);
    };
  }, []);

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#home">
          UJJWAL<span>.</span>
        </a>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          MENU {menuOpen ? "×" : "＋"}
        </button>
        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            01 HOME
          </a>
          <a href="#work" onClick={() => setMenuOpen(false)}>
            02 WORK
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            03 ABOUT
          </a>
          <a href="#stack" onClick={() => setMenuOpen(false)}>
            04 STACK
          </a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>
            CONTACT
          </a>
        </div>
        <span className="availability">
          <i /> AVAILABLE
        </span>
      </nav>
      <section id="home" className="hero section-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            SYS.STATUS / ONLINE <span>·</span> BUILD / V2.6
          </div>
          <h1>
            BUILD.
            <br />
            <em>SHIP.</em>
            <br />
            REPEAT<span className="blue">.</span>
          </h1>
          <p className="hero-intro">
            I&apos;m Ujjwal, A computer science student and fullstack
            developer building useful software, solving real problems, and
            turning curious ideas into working systems.
          </p>
          <div className="cta-row">
            <a className="button button-blue" href="#work">
              [ VIEW MY WORK <Arrow /> ]
            </a>
            <a
              className="button"
              href="https://github.com/ujjwal-py"
              target="_blank"
              rel="noreferrer"
            >
              [ GITHUB <Arrow diagonal /> ]
            </a>
          </div>
        </div>
        <div className="hero-side">
          <div className="side-label">
            STACK / WEB + AI
            <br />
            STATUS / BUILDING
          </div>
          <HeroTerminal />
          <span className="vertical-note">
            COORDINATES / 28.6139° N · 77.2090° E
          </span>
        </div>
      </section>
      <div className="ticker" aria-label="Technology stack">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <div className="ticker-content" aria-hidden={copy === 1} key={copy}>
              <span>FULL-STACK DEVELOPMENT</span>
              <b>•</b>
              <span>REACT.js</span>
              <b>•</b>
              <span>NODE.js</span>
              <b>•</b>
              <span>EXPRESS.js</span>
              <b>•</b>
              <span>NEXT.js</span>
              <b>•</b>
              <span>TYPESCRIPT</span>
              <b>•</b>
              <span>JAVASCRIPT</span> 
              <b>•</b>
              <span>PostgreSQL</span>
              <b>•</b>
              <span>MongoDB</span>
              <b>•</b>
              <span>MICROSOFT AZURE</span>
              <b>•</b>
              <span>AWS</span>
              <b>•</b>
              <span>AI / ML</span>
              <b>•</b>
            </div>
          ))}
        </div>
      </div>
      <section id="work" className="work section-pad">
        <SectionLabel number="01">SELECTED PROJECTS</SectionLabel>
        <div className="section-heading-row">
          <h2>
            THINGS I<br />
            <span>HAVE BUILT.</span>
          </h2>
          <p>
            Selected experiments, shipped products, and interfaces from the lab.
            Open a project to inspect its case study.
          </p>
        </div>
        <div className="projects">
          {projects.map((project) => (
            <ProjectCard
              key={project.number}
              project={project}
              onOpen={() => setActiveProject(project)}
            />
          ))}
        </div>
      </section>
      <section id="about" className="about section-pad">
        <SectionLabel number="02">THE BUILDER</SectionLabel>
        <div className="about-layout">
          <h2>
            ABOUT
            <br />
            <span>THE BUILDER.</span>
          </h2>
          <div className="about-copy">
            <p className="large-copy">
              I like understanding how systems work and then making them simpler,
              sharper, and more useful.
            </p>
            <p>
              Computer Science student. Full-stack developer. Perpetual learner.
              I move between interfaces, APIs, databases, and the problem
              underneath them.
            </p>
            <div className="metadata-grid">
              <div>
                <span>ROLE</span>
                <strong>FULL-STACK DEVELOPER</strong>
              </div>
              <div>
                <span>FOCUS</span>
                <strong>WEB / BACKEND / AI</strong>
              </div>
              <div>
                <span>CURRENTLY LEARNING</span>
                <strong>SYSTEM DESIGN / DEV OPS</strong>
              </div>
              <div>
                <span>BASED IN</span>
                <strong>INDIA</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="stack" className="stack section-pad">
        <SectionLabel number="03">TOOLS OF THE TRADE</SectionLabel>
        <div className="section-heading-row">
          <h2>
            THE
            <br />
            <span>STACK.</span>
          </h2>
          <p>
            The tools in my current working vocabulary. Always learning, always
            refining.
          </p>
        </div>
        <div className="stack-grid">
          {Object.entries(stack).map(([category, tools]) => (
            <div className="stack-group" key={category}>
              <h3>{category}</h3>
              <div>
                {tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="metrics section-pad">
        <SectionLabel number="04">PROBLEM SOLVING</SectionLabel>
        <div className="metrics-grid">
          <div className="metric">
            <strong>DSA</strong>
            <span>THE DAILY PRACTICE</span>
          </div>
          <div className="metric">
            <strong>C++</strong>
            <span>PRIMARY LANGUAGE</span>
          </div>
          <div className="metric">
            <strong>∞</strong>
            <span>PROBLEMS TO SOLVE</span>
          </div>
        </div>
      </section>
      <section className="build section-pad">
        <SectionLabel number="05">LIVE BUILD LOG</SectionLabel>
        <div className="terminal">
          <div className="terminal-bar">
            <span>ujjwal@lab:~$ cat currently-building.log</span>
            <span>● LIVE</span>
          </div>
          <div className="terminal-content">
            <h2>
              CURRENTLY
              <br />
              <span>BUILDING.</span>
            </h2>
            {recentCommits.length ? (
              recentCommits.map((commit, index) => (
                <a
                  className="log-row log-commit"
                  href={commit.url}
                  target="_blank"
                  rel="noreferrer"
                  key={`${commit.url}-${commit.timestamp}`}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{commit.repository}</b>
                  <p>{commit.message}</p>
                  <i>↗</i>
                </a>
              ))
            ) : (
              buildLog.map(([id, label, value]) => (
                <div className="log-row" key={id}>
                  <span>{id}</span>
                  <b>{label}</b>
                  <p>{value}</p>
                  <i>→</i>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <section className="github section-pad">
        <SectionLabel number="06">CODE / OPEN SOURCE</SectionLabel>
        <div className="github-layout">
          <h2>
            CODE IS
            <br />
            <span>THE MEDIUM.</span>
          </h2>
          <div>
            <pre>
              <code>
                <span>const</span> idea = <em>&quot;curiosity&quot;</em>;<br />
                <span>while</span> (idea) &#123;
                <br /> build();
                <br /> learn();
                <br />
                &#125;
              </code>
            </pre>
            <a
              className="button button-blue"
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
            >
              [ OPEN GITHUB <Arrow diagonal /> ]
            </a>
          </div>
        </div>
      </section>
      <section id="contact" className="contact section-pad">
        <div className="contact-label">07 / CONTACT</div>
        <h2>
          LET&apos;S BUILD
          <br />
          <span>SOMETHING.</span>
        </h2>
        <div className="contact-bottom">
          <p>
            Have a problem worth solving or an idea worth testing? Send a
            signal.
          </p>
          <div>
            <a href="mailto:ujjwal372828@gmail.com">
              EMAIL <Arrow diagonal />
            </a>
            <a href="https://www.linkedin.com/in/ujjwalkr17/" target="_blank" rel="noreferrer">
              LINKEDIN <Arrow diagonal />
            </a>
            <a href="https://github.com/ujjwal-py" target="_blank" rel="noreferrer">
              GITHUB <Arrow diagonal />
            </a>
          </div>
        </div>
      </section>
      <footer>
        <span className="brand">
          UJJWAL<span>.</span>
        </span>
        <span>FULL-STACK DEVELOPER / COMPUTER SCIENCE STUDENT</span>
        <span>
          © 2026 · <i /> SYSTEM ONLINE
        </span>
      </footer>
      {activeProject && (
        <ProjectDialog
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </main>
  );
}
