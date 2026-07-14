import React, { useState, useEffect, useRef } from "react";
import {
  Link2, Briefcase, Mail, ExternalLink, Terminal, Code2,
  GitCommit, FolderGit2, ChevronRight, Sparkles, Send, Loader2
} from "lucide-react";
import "./App.css";

const colors = {
  bg: "#0A0E12",
  surface: "#12181F",
  surfaceAlt: "#161D25",
  border: "#232B34",
  text: "#E7EBEE",
  textMuted: "#8B98A5",
  textFaint: "#5C6772",
  amber: "#E8A33D",
  teal: "#3FB8AF",
  rose: "#E2596B",
  green: "#3DDC84",
};

const stats = [
  { label: "Problems solved", value: "300+" },
  { label: "Best model ROC-AUC", value: "0.814" },
  { label: "Projects shipped", value: "4" },
  { label: "CGPA", value: "7.68" },
];

const languageBar = [
  { name: "Python", pct: 34, color: colors.teal },
  { name: "Java", pct: 26, color: colors.amber },
  { name: "JavaScript", pct: 22, color: "#7FA8D9" },
  { name: "SQL", pct: 10, color: colors.rose },
  { name: "Other", pct: 8, color: colors.textFaint },
];

const skillGroups = [
  { label: "Languages", items: ["Java", "Python", "JavaScript", "SQL"] },
  { label: "AI / LLM", items: ["Groq API", "Claude API", "Gemini API", "Prompt Engineering", "Hallucination Detection"] },
  { label: "Frameworks", items: ["React", "Vite", "FastAPI", "Firebase"] },
  { label: "Data / ML", items: ["Pandas", "Scikit-learn", "EDA", "Collaborative Filtering"] },
  { label: "Tools", items: ["Git", "GitHub", "Vercel", "Postman"] },
];

const projects = [
  {
    name: "medical-report-summarizer",
    tag: "Final Year Project",
    description:
      "AI-powered tool that summarizes medical reports and flags hallucinated content before it reaches a patient. FastAPI backend, React/Vite frontend, deployed on Vercel.",
    stack: ["FastAPI", "React", "Vite", "Groq (Llama)"],
    difficulty: "Hard",
  },
  {
    name: "ai-feasta",
    tag: "GenAI Web App",
    description:
      "Chatbot and image-generation app in one interface, backed by Claude and Gemini APIs with Firebase for auth and storage.",
    stack: ["React", "FastAPI", "Claude API", "Gemini API", "Firebase"],
    difficulty: "Medium",
  },
  {
    name: "churnguard",
    tag: "ML Pipeline",
    description:
      "Telecom customer-churn prediction pipeline with a full preprocessing and evaluation workflow, reaching 0.814 ROC-AUC.",
    stack: ["Python", "Scikit-learn", "Pandas"],
    difficulty: "Medium",
  },
  {
    name: "trendpulse",
    tag: "ETL Pipeline",
    description:
      "Reddit ETL pipeline that pulls, cleans, and structures post and comment data for downstream trend analysis.",
    stack: ["Python", "Reddit API", "ETL"],
    difficulty: "Easy",
  },
];

const difficultyColor = {
  Easy: colors.green,
  Medium: colors.amber,
  Hard: colors.rose,
};

const commits = [
  {
    hash: "9f1a2c4",
    message: "Generative AI Engineer Intern",
    org: "Blackbucks Education",
    date: "2026 — present",
    body: "Building and shipping GenAI applications; deployed the medical report summarizer with hallucination detection to production.",
  },
  {
    hash: "6b7e0d1",
    message: "Campus Mantri",
    org: "GeeksforGeeks",
    date: "2025 — present",
    body: "Led GATE course and SkillUp promotion campaigns at GIST; completed all campus tasks (600/600 points).",
  },
  {
    hash: "3a4c8f2",
    message: "AI & ML Certificate Program",
    org: "IIT Patna x Masai School",
    date: "2025",
    body: "Coursework and assignments spanning EDA, preprocessing, collaborative filtering, and end-to-end ML workflows.",
  },
  {
    hash: "1d0e9a7",
    message: "Automotive Service Technician — LEAP",
    org: "Bosch India Foundation",
    date: "2024",
    body: "Certification covering automotive service fundamentals and applied technical training.",
  },
];

const links = [
  { flag: "--github", label: "github.com/J-harshavardhan", href: "https://github.com/J-harshavardhan", icon: Link2 },
  { flag: "--linkedin", label: "linkedin.com/in/jagannati-harshavardhan", href: "https://linkedin.com/in/jagannati-harshavardhan/", icon: Briefcase },
  { flag: "--leetcode", label: "JAGANNATI_HARSHAVARDHAN", href: "https://leetcode.com/u/JAGANNATI_HARSHAVARDHAN", icon: Code2 },
  { flag: "--gfg", label: "jharshavardhan", href: "https://geeksforgeeks.org/profile/jharshavardhan", icon: Terminal },
];

const suggestedPrompts = [
  "What's Harsha's strongest project?",
  "What can Harsha bring to a Java role?",
  "How much DSA has he practiced?",
  "What AI tools does he work with?",
];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Section({ id, eyebrow, title, children }) {
  const [ref, visible] = useReveal();
  return (
    <section id={id} ref={ref} className={`container section ${visible ? "visible" : ""}`}>
      <div className="section-header">
        <p className="eyebrow font-mono" style={{ color: colors.amber }}>{eyebrow}</p>
        <h2 className="section-title" style={{ color: colors.text }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AskAI() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey, I'm Harsha's portfolio AI. Ask me anything about his projects, skills, or background.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  async function send(question) {
    const q = (question ?? input).trim();
    if (!q || loading) return;
    setError(null);
    setInput("");
    const nextMessages = [...messages, { role: "user", text: q }];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((m) => m.role === "user" || m.role === "assistant")
            .map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      if (!response.ok) throw new Error("Backend error");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.text || "Hmm, I didn't get a response. Try asking again." },
      ]);
    } catch (e) {
      setError("Couldn't reach the assistant right now.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chat" style={{ border: `1px solid ${colors.teal}55`, background: colors.surface }}>
      <div className="chat-header" style={{ borderBottom: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
        <Sparkles size={14} style={{ color: colors.teal }} />
        <span className="chat-label font-mono" style={{ color: colors.teal }}>
          ask-harsha-ai — live, powered by Llama 3.3
        </span>
      </div>

      <div ref={scrollRef} className="chat-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg-row ${m.role}`}>
            <div
              className="msg-bubble"
              style={
                m.role === "user"
                  ? { background: colors.teal, color: "#04211D" }
                  : { background: colors.surfaceAlt, color: colors.text, border: `1px solid ${colors.border}` }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg-row assistant">
            <div className="loading-bubble" style={{ background: colors.surfaceAlt, color: colors.textMuted, border: `1px solid ${colors.border}` }}>
              <Loader2 size={14} className="spin" />
              thinking...
            </div>
          </div>
        )}
        {error && <p className="error-text font-mono" style={{ color: colors.rose }}>{error}</p>}
      </div>

      <div className="prompt-chips">
        {suggestedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => send(p)}
            disabled={loading}
            className="prompt-chip font-mono"
            style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="chat-form"
        style={{ borderTop: `1px solid ${colors.border}` }}
      >
        <span className="chat-dollar font-mono" style={{ color: colors.green }}>$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Harsha's skills, projects, or fit for a role..."
          className="chat-input"
          style={{ color: colors.text }}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="send-btn"
          style={{ background: colors.teal, color: "#04211D", opacity: loading || !input.trim() ? 0.5 : 1 }}
          aria-label="Send"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

export default function Portfolio() {
  const [navOpen, setNavOpen] = useState(false);
  const sections = ["ask-ai", "about", "projects", "skills", "experience", "contact"];

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", color: colors.text }}>
      {/* NAV */}
      <header className="header" style={{ background: "rgba(10,14,18,0.85)", borderBottom: `1px solid ${colors.border}` }}>
        <div className="header-inner">
          <a href="#top" className="logo font-mono" style={{ color: colors.teal }}>
            harsha@portfolio<span style={{ color: colors.textMuted }}>:~$</span>
          </a>
          <nav className="nav-links font-mono">
            {sections.map((s) => (
              <a
                key={s}
                href={`#${s}`}
                className="nav-link"
                style={{ color: s === "ask-ai" ? colors.teal : colors.textMuted }}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
                onMouseLeave={(e) => (e.currentTarget.style.color = s === "ask-ai" ? colors.teal : colors.textMuted)}
              >
                ./{s}
              </a>
            ))}
          </nav>
          <button
            className="menu-btn font-mono"
            style={{ border: `1px solid ${colors.border}`, color: colors.textMuted }}
            onClick={() => setNavOpen(!navOpen)}
          >
            menu
          </button>
        </div>
        {navOpen && (
          <div className="mobile-nav font-mono">
            {sections.map((s) => (
              <a key={s} href={`#${s}`} style={{ color: colors.textMuted }} onClick={() => setNavOpen(false)}>
                ./{s}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* HERO */}
      <div id="top" className="hero-wrap">
        <div className="terminal" style={{ border: `1px solid ${colors.border}`, background: colors.surface }}>
          <div className="terminal-header" style={{ borderBottom: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
            <span className="term-dot" style={{ background: colors.rose }} />
            <span className="term-dot" style={{ background: colors.amber }} />
            <span className="term-dot" style={{ background: colors.green }} />
            <span className="terminal-label font-mono" style={{ color: colors.textFaint }}>harsha — zsh</span>
          </div>
          <div className="terminal-body font-mono">
            <p style={{ color: colors.textMuted }}><span style={{ color: colors.green }}>$</span> whoami</p>
            <p className="hero-name font-display" style={{ color: colors.text }}>J. Harshavardhan</p>
            <p style={{ color: colors.textMuted }}><span style={{ color: colors.green }}>$</span> cat role.txt</p>
            <p className="hero-line" style={{ color: colors.amber }}>
              Generative AI Engineer Intern @ Blackbucks Education
            </p>
            <p style={{ color: colors.textMuted }}><span style={{ color: colors.green }}>$</span> cat about.txt</p>
            <p className="hero-about" style={{ color: colors.text }}>
              B.Tech AI &amp; ML student at GIST, Nellore &middot; building LLM-powered apps &middot;
              300+ problems deep into competitive programming.
              <span className="cursor" style={{ color: colors.teal }}>&#9608;</span>
            </p>
          </div>
        </div>

        <div className="scoreboard">
          {stats.map((s) => (
            <div key={s.label} className="stat-card" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
              <p className="stat-value font-mono" style={{ color: colors.teal }}>{s.value}</p>
              <p className="stat-label" style={{ color: colors.textMuted }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ASK AI */}
      <Section id="ask-ai" eyebrow="00 · live demo" title="Ask my AI instead of reading the rest">
        <p className="ask-ai-desc" style={{ color: colors.textMuted }}>
          This isn't a static FAQ — it's a real call to an LLM, grounded in Harsha's actual background.
          Same pattern he used to build the medical report summarizer, just pointed at his own resume.
        </p>
        <AskAI />
      </Section>

      {/* ABOUT */}
      <Section id="about" eyebrow="01 · about" title="A bit more context">
        <p className="about-text" style={{ color: colors.textMuted }}>
          I'm a final-year AI &amp; ML student at Geethanjali Institute of Science and Technology,
          graduating in 2027. Day to day, I'm interning as a Generative AI Engineer at Blackbucks
          Education, and volunteering as GeeksforGeeks Campus Mantri — running promotion campaigns
          and helping other students get into competitive programming and DSA. Outside of coursework,
          I spend a lot of time on LeetCode and GFG in Java, and building small end-to-end ML and
          LLM projects to see how the theory holds up in production.
        </p>
      </Section>

      {/* PROJECTS */}
      <Section id="projects" eyebrow="02 · projects" title="Things I've shipped">
        <div className="projects-grid">
          {projects.map((p) => (
            <div key={p.name} className="project-card" style={{ background: colors.surface, border: `1px solid ${colors.border}` }}>
              <div className="project-top">
                <div className="project-name-wrap">
                  <FolderGit2 size={16} style={{ color: colors.textFaint }} />
                  <span className="project-name font-mono" style={{ color: colors.teal }}>{p.name}</span>
                </div>
                <span
                  className="difficulty-badge font-mono"
                  style={{ color: difficultyColor[p.difficulty], border: `1px solid ${difficultyColor[p.difficulty]}44` }}
                >
                  {p.difficulty}
                </span>
              </div>
              <p className="project-tag font-mono" style={{ color: colors.amber }}>{p.tag}</p>
              <p className="project-desc" style={{ color: colors.textMuted }}>{p.description}</p>
              <div className="project-stack">
                {p.stack.map((t) => (
                  <span key={t} className="stack-tag font-mono" style={{ background: colors.surfaceAlt, color: colors.textMuted, border: `1px solid ${colors.border}` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* SKILLS */}
      <Section id="skills" eyebrow="03 · skills" title="What I work with">
        <div className="skills-block">
          <div className="lang-bar" style={{ border: `1px solid ${colors.border}` }}>
            {languageBar.map((l) => (
              <div key={l.name} style={{ width: `${l.pct}%`, background: l.color }} title={`${l.name} ${l.pct}%`} />
            ))}
          </div>
          <div className="lang-legend font-mono">
            {languageBar.map((l) => (
              <span key={l.name} className="legend-item" style={{ color: colors.textMuted }}>
                <span className="legend-dot" style={{ background: l.color }} />
                {l.name} · {l.pct}%
              </span>
            ))}
          </div>
        </div>

        <div className="skill-groups">
          {skillGroups.map((g) => (
            <div key={g.label}>
              <p className="skill-group-label font-mono" style={{ color: colors.textFaint }}>{g.label.toUpperCase()}</p>
              <div className="skill-pills">
                {g.items.map((item) => (
                  <span key={item} className="skill-pill" style={{ border: `1px solid ${colors.border}`, color: colors.text, background: colors.surface }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" eyebrow="04 · experience" title="Commit log">
        <div className="timeline" style={{ borderLeft: `1px solid ${colors.border}` }}>
          {commits.map((c) => (
            <div key={c.hash} className="commit-item">
              <span className="commit-dot" style={{ background: colors.bg, border: `2px solid ${colors.teal}` }} />
              <div className="commit-meta font-mono" style={{ color: colors.textFaint }}>
                <GitCommit size={12} />
                <span style={{ color: colors.amber }}>{c.hash}</span>
                <span>{c.date}</span>
              </div>
              <p className="commit-message" style={{ color: colors.text }}>
                {c.message}
                <span className="commit-org" style={{ color: colors.textMuted }}> — {c.org}</span>
              </p>
              <p className="commit-body" style={{ color: colors.textMuted }}>{c.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CONTACT */}
      <Section id="contact" eyebrow="05 · contact" title="Get in touch">
        <div className="contact-card" style={{ border: `1px solid ${colors.border}`, background: colors.surface }}>
          <div className="contact-header" style={{ borderBottom: `1px solid ${colors.border}`, background: colors.surfaceAlt }}>
            <span className="term-dot" style={{ background: colors.rose }} />
            <span className="term-dot" style={{ background: colors.amber }} />
            <span className="term-dot" style={{ background: colors.green }} />
            <span className="contact-label font-mono" style={{ color: colors.textFaint }}>contact.sh</span>
          </div>
          <div className="contact-body font-mono">
            <p className="contact-line" style={{ color: colors.textMuted }}>
              <span style={{ color: colors.green }}>$</span> contact --send
            </p>
            <a href="mailto:jharshavardhan28@gmail.com" className="contact-link" style={{ color: colors.text }}>
              <Mail size={15} style={{ color: colors.textFaint }} />
              <span style={{ color: colors.teal }}>--email</span>
              <ChevronRight size={13} style={{ color: colors.textFaint }} />
              <span>jharshavardhan28@gmail.com</span>
            </a>
            {links.map((l) => (
              <a key={l.flag} href={l.href} target="_blank" rel="noopener noreferrer" className="contact-link" style={{ color: colors.text }}>
                <l.icon size={15} style={{ color: colors.textFaint }} />
                <span style={{ color: colors.teal }}>{l.flag}</span>
                <ChevronRight size={13} style={{ color: colors.textFaint }} />
                <span className="contact-link-extra">
                  {l.label}
                  <ExternalLink size={11} style={{ color: colors.textFaint }} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <footer className="footer font-mono" style={{ color: colors.textFaint }}>
        built with React &middot; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
