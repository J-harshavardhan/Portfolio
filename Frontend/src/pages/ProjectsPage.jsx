import React, { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePortfolioData } from "../context/PortfolioDataContext";

const PAGE_SIZE = 4;

export default function ProjectsPage() {
  const { data, loading, error } = usePortfolioData();
  const [searchTerm, setSearchTerm] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading projects...</p>
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

  const { projects } = data;
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const term = searchTerm.trim().toLowerCase();
      const matchesText =
        !term ||
        project.name.toLowerCase().includes(term) ||
        project.tag.toLowerCase().includes(term) ||
        project.shortDescription.toLowerCase().includes(term) ||
        project.stack.some((s) => s.toLowerCase().includes(term));
      const matchesDifficulty = difficulty === "All" || project.difficulty === difficulty;
      return matchesText && matchesDifficulty;
    });
  }, [projects, searchTerm, difficulty]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const visibleProjects = filteredProjects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Projects</p>
        <h2>All Projects</h2>
      </div>
      <p className="about-copy">
        This page lists all portfolio projects. Open any card to view complete details including goals,
        technical choices, implementation highlights, and outcomes.
      </p>

      <div className="filter-row top-gap">
        <input
          className="filter-input"
          type="text"
          placeholder="Search by name, stack, or keyword"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="filter-select"
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="All">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <p className="results-note top-gap">Showing {filteredProjects.length} project(s)</p>

      <div className="project-grid top-gap">
        {visibleProjects.map((project) => (
          <article key={project.slug} className="project-card">
            <div className="project-head">
              <p className="project-name">{project.name}</p>
              <span className={`badge ${project.difficulty.toLowerCase()}`}>{project.difficulty}</span>
            </div>
            <p className="project-tag">{project.tag}</p>
            <p className="project-desc">{project.shortDescription}</p>
            <div className="project-stack">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <Link to={`/projects/${project.slug}`} className="inline-action">
              Open Full Details <ArrowUpRight size={14} />
            </Link>
          </article>
        ))}
      </div>

      {filteredProjects.length === 0 && <p className="state-text top-gap">No projects match this filter.</p>}

      {filteredProjects.length > 0 && (
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
