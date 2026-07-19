import React, { useMemo, useState } from "react";
import { usePortfolioData } from "../context/PortfolioDataContext";

const PAGE_SIZE = 4;

export default function AchievementsPage() {
  const { data, loading, error } = usePortfolioData();
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading achievements...</p>
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

  const { achievements } = data;
  const totalPages = Math.max(1, Math.ceil(achievements.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleAchievements = useMemo(
    () => achievements.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [achievements, safePage]
  );

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Achievements</p>
        <h2>Experience and Milestones</h2>
      </div>
      <p className="about-copy">
        Full details of internships, certifications, and leadership milestones with specific impact points.
      </p>

      <div className="timeline top-gap">
        {visibleAchievements.map((item) => (
          <article key={item.id} className="time-item detail-card">
            <div className="time-head">
              <h3>{item.title}</h3>
              <p>{item.period}</p>
            </div>
            <p className="time-org">{item.organization}</p>
            <p className="time-body">{item.details}</p>
            <div className="detail-block">
              <h3>Impact</h3>
              <ul>
                {item.impact.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      {achievements.length > 0 && (
        <div className="pagination-row top-gap">
          <button
            type="button"
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
          >
            Previous
          </button>
          <p>
            Page {safePage} of {totalPages}
          </p>
          <button
            type="button"
            className="page-btn"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
