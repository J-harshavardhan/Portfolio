import React, { useState } from "react";
import { ArrowUpRight, Download, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import AskAI from "../components/AskAI";
import ElectricBorder from "../components/ElectricBorder/ElectricBorder";
import { AnimatedSectionHeading, AnimatedStatTile, InteractiveCard, MagneticButton } from "../components/InteractiveEffects";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { downloadResumePdf } from "../lib/resumePdf";

export default function HomePage() {
  const { data, loading, error } = usePortfolioData();
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeError, setResumeError] = useState("");
  const [brandColor, setBrandColor] = useState("#0f8b8d");

  React.useEffect(() => {
    const computed = getComputedStyle(document.documentElement).getPropertyValue("--brand").trim();
    if (computed) {
      setBrandColor(computed);
    }
  }, []);

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
        <div className="hero-background-layer" aria-hidden="true">
          <div className="hero-orb-fallback" />
          <div className="hero-background-overlay" />
        </div>
        <div className="hero-copy">
          <p className="hero-kicker">{profile.role}</p>
          <h1>{profile.tagline}</h1>
          <p className="hero-text">{profile.summary}</p>
          <div className="hero-actions">
            <ElectricBorder
              color={brandColor}
              speed={1.4}
              chaos={0.09}
              borderRadius={999}
              className="electric-border-cta"
              style={{ display: "inline-block" }}
            >
              <MagneticButton to="/projects" className="btn-primary">
                Explore Projects <ArrowUpRight size={15} />
              </MagneticButton>
            </ElectricBorder>
            <MagneticButton to="/achievements" className="btn-ghost">
              See Achievements
            </MagneticButton>
            <MagneticButton className="btn-ghost" onClick={handleResumeDownload} disabled={resumeBusy}>
              <Download size={15} /> {resumeBusy ? "Generating PDF..." : "Download Resume"}
            </MagneticButton>
          </div>
          {resumeError ? <p className="resume-error top-gap">{resumeError}</p> : null}
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
          <ElectricBorder
            key={s.label}
            color={brandColor}
            speed={1}
            chaos={0.09}
            borderRadius={18}
            className="electric-border-stat"
            style={{ width: "100%" }}
          >
            <AnimatedStatTile label={s.label} value={s.value} />
          </ElectricBorder>
        ))}
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
