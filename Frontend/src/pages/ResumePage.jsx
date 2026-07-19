import React from "react";
import { Download } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function ResumePage() {
  const { data, loading, error } = usePortfolioData();

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading resume...</p>
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

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Resume</p>
        <h2>{data.resume.title}</h2>
      </div>

      <article className="detail-card">
        <p className="project-desc">{data.resume.summary}</p>

        <a href={data.profile.resumeFile} download className="btn btn-primary top-gap">
          <Download size={15} /> Download Resume
        </a>

        <div className="resume-grid top-gap">
          {data.resume.sections.map((section) => (
            <div key={section.heading} className="detail-block">
              <h3>{section.heading}</h3>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
