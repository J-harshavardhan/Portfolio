import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function ProjectDetailPage() {
  const { data, loading, error } = usePortfolioData();
  const { slug } = useParams();
  const { projects } = data;
  const project = projects.find((item) => item.slug === slug);

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading project details...</p>
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

  if (!project) {
    return (
      <section className="shell section visible page-intro-space">
        <div className="section-head">
          <p className="section-kicker">Project</p>
          <h2>Project Not Found</h2>
        </div>
        <Link to="/projects" className="inline-action">
          <ArrowLeft size={14} /> Back to Projects
        </Link>
      </section>
    );
  }

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Project Details</p>
        <h2>{project.name}</h2>
      </div>

      <article className="detail-card">
        <p className="project-tag">{project.tag}</p>
        <p className="project-desc">{project.fullDescription}</p>

        <div className="detail-block">
          <h3>Tech Stack</h3>
          <div className="project-stack">
            {project.stack.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>

        <div className="detail-block">
          <h3>Implementation Highlights</h3>
          <ul>
            {project.highlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="detail-block">
          <h3>Outcomes</h3>
          <ul>
            {project.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {Array.isArray(project.images) && project.images.length > 0 && (
          <div className="detail-block">
            <h3>Project Gallery</h3>
            <div className="gallery-grid">
              {project.images.map((image) => (
                <figure key={image.src} className="gallery-item">
                  <img src={image.src} alt={image.alt} loading="lazy" />
                  <figcaption>{image.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}
      </article>

      <Link to="/projects" className="inline-action top-gap">
        <ArrowLeft size={14} /> Back to Projects
      </Link>
    </section>
  );
}
