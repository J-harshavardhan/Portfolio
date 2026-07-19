import React from "react";
import { ExternalLink, Mail } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function ContactPage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading contact details...</p>
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

  const { links, profile } = data;

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Contact</p>
        <h2>Reach Out</h2>
      </div>
      <p className="about-copy">
        For internships, collaborations, and project discussions, connect through email or platforms below.
      </p>

      <div className="contact-card top-gap">
        <a className="email-row" href={`mailto:${profile.email}`}>
          <Mail size={16} />
          {profile.email}
        </a>

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
      </div>
    </section>
  );
}
