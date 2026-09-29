import React, { useState } from "react";
import { ArrowUpRight, Download, ExternalLink, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import AskAI from "../components/AskAI";
import { AnimatedSectionHeading, AnimatedStatTile, InteractiveCard, MagneticButton } from "../components/InteractiveEffects";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { downloadResumePdf } from "../lib/resumePdf";

export default function HomePage() {
  const { data, loading, error } = usePortfolioData();
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeError, setResumeError] = useState("");

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

  const { profile, stats, projects, links } = data;

  const handleResumeDownload = async () => {
    try {
      setResumeBusy(true);
      setResumeError("");
      await downloadResumePdf(data);
    } catch (downloadError) {
      setResumeError(downloadError.message || "Could not generate the PDF.");
    } finally {
      setResumeBusy(false);
    }
  };

  return (
    <>
      <section className="hero shell">
        <div className="hero-copy">
          <p className="hero-kicker">{profile.role}</p>
          <h1>Building useful AI products with <em>clarity.</em></h1>
          <p className="hero-text">{profile.summary}</p>
          <div className="hero-meta"><span><MapPin size={14} /> {profile.location}</span><span className="status-dot">Available for conversations</span></div>
          <div className="hero-actions">
            <MagneticButton to="/projects" className="btn-primary">
              Explore Projects <ArrowUpRight size={15} />
            </MagneticButton>
            <MagneticButton to="/achievements" className="btn-ghost">
              See Achievements
            </MagneticButton>
            <MagneticButton className="btn-ghost" onClick={handleResumeDownload} disabled={resumeBusy}>
              <Download size={15} /> {resumeBusy ? "Generating PDF..." : "Download Resume"}
            </MagneticButton>
          </div>
          {resumeError ? <p className="resume-error top-gap">{resumeError}</p> : null}
        </div>

        <aside className="hero-panel profile-panel interactive-card">
          <img src={profile.photo} alt="J. Harshavardhan profile" className="profile-photo" />
          <div className="profile-caption"><span className="eyebrow">Currently building</span><p className="panel-title">Reliable AI experiences</p></div>
          <a className="hero-mail" href={`mailto:${profile.email}`}>
            <Mail size={14} /> {profile.email}
          </a>
        </aside>
      </section>

      <section className="shell stats-grid" aria-label="Highlights">
        {stats.map((s) => <AnimatedStatTile key={s.label} label={s.label} value={s.value} />)}
      </section>

      <section className="shell section visible">
        <AnimatedSectionHeading kicker="Quick Access" title="Full Details By Section" />
        <div className="project-grid">
          {projects.map((project) => (
            <InteractiveCard key={project.slug} className="project-card" as="article">
              <div className="project-head">
                <p className="project-name">{project.name}</p>
                <span className={`badge ${project.difficulty.toLowerCase()}`}>{project.difficulty}</span>
              </div>
              <p className="project-tag">{project.tag}</p>
              <p className="project-desc">{project.shortDescription}</p>
              <Link to={`/projects/${project.slug}`} className="inline-action">
                Open Full Project Details <ArrowUpRight size={14} />
              </Link>
            </InteractiveCard>
          ))}
        </div>
      </section>

      <section className="shell section visible">
        <AnimatedSectionHeading kicker="Links" title="Profile Platforms" />
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
        <AnimatedSectionHeading kicker="Assistant" title="Ask For More Details" />
        <AskAI />
      </section>
    </>
  );
}
