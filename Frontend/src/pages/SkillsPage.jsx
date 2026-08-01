import React from "react";
import { AnimatedSectionHeading, InteractiveCard } from "../components/InteractiveEffects";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function SkillsPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading skills...</p>
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

  const { languageBar, skillGroups } = data;

  return (
    <section className="shell section visible page-intro-space">
      <AnimatedSectionHeading kicker="Skills" title="Skill Breakdown" />
      <p className="about-copy">
        This section gives full details of current capabilities, where each skill group is applied, and
        how these skills contribute to project delivery.
      </p>

      <div className="lang-wrap top-gap">
        <div className="lang-track" role="img" aria-label="Language usage">
          {languageBar.map((l) => (
            <span key={l.name} style={{ width: `${l.pct}%` }} className={`lang-slice ${l.name.toLowerCase()}`} />
          ))}
        </div>
        <div className="lang-legend">
          {languageBar.map((l) => (
            <p key={l.name}>
              <span className={`dot ${l.name.toLowerCase()}`} /> {l.name} {l.pct}%
            </p>
          ))}
        </div>
      </div>

      <div className="skills-grid top-gap">
        {skillGroups.map((group, index) => (
          <InteractiveCard
            key={group.id}
            className="skill-card detail-card"
            as="article"
            transition={{ duration: 0.45, ease: "easeOut", delay: index * 0.08 }}
          >
            <h3>{group.title}</h3>
            <p className="skill-summary">{group.summary}</p>
            <p className="project-desc">{group.details}</p>
            <div className="skill-pills">
              {group.items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </InteractiveCard>
        ))}
      </div>
    </section>
  );
}
