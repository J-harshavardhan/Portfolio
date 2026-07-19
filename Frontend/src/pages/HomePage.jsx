import React from "react";
import { ArrowUpRight, Download, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AskAI from "../components/AskAI";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function HomePage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading portfolio...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text state-error">{error}</p>
      </section>
    );
  }

  const { profile, stats, projects, links, suggestedPrompts } = data;

  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="hero-kicker">{profile.role}</p>
          <h1>{profile.tagline}</h1>
          <p className="hero-text">{profile.summary}</p>
          <div className="hero-actions">
            <Link to="/projects" className="btn btn-primary">
              Explore Projects <ArrowUpRight size={15} />
            </Link>
            <Link to="/achievements" className="btn btn-ghost">
              See Achievements
            </Link>
            <a href={profile.resumeFile} download className="btn btn-ghost">
              <Download size={15} /> Download Resume
            </a>
          </div>
        </div>

        <aside className="hero-panel profile-panel">
          <img src={profile.photo} alt="J. Harshavardhan profile" className="profile-photo" />
          <p className="panel-title">{profile.name}</p>
          <p className="panel-note">{profile.location}</p>
          <a className="hero-mail" href={`mailto:${profile.email}`}>
            <Mail size={14} /> {profile.email}
          </a>
        </aside>
      </section>

      <section className="shell stats-grid" aria-label="Highlights">
        {stats.map((s) => (
          <article key={s.label} className="stat-tile">
            <p className="stat-value">{s.value}</p>
            <p className="stat-label">{s.label}</p>
          </article>
        ))}
      </section>

      <section className="shell section visible">
        <div className="section-head">
          <p className="section-kicker">Quick Access</p>
          <h2>Full Details By Section</h2>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.slug} className="project-card">
              <div className="project-head">
                <p className="project-name">{project.name}</p>
                <span className={`badge ${project.difficulty.toLowerCase()}`}>{project.difficulty}</span>
              </div>
              <p className="project-tag">{project.tag}</p>
              <p className="project-desc">{project.shortDescription}</p>
              <Link to={`/projects/${project.slug}`} className="inline-action">
                Open Full Project Details <ArrowUpRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="shell section visible">
        <div className="section-head">
          <p className="section-kicker">Links</p>
          <h2>Profile Platforms</h2>
        </div>
        <div className="contact-links">
          {links.map((item) => (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
              <span>{item.label}</span>
              <span>
                {item.value} <ExternalLink size={13} />
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="shell section visible">
        <div className="section-head">
          <p className="section-kicker">Assistant</p>
          <h2>Ask For More Details</h2>
        </div>
        <AskAI prompts={suggestedPrompts} />
      </section>
    </>
  );
}
