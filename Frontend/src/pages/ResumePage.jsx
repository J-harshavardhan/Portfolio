import React, { useState } from "react";
import { Download } from "lucide-react";
import { AnimatedSectionHeading, MagneticButton } from "../components/InteractiveEffects";
import { usePortfolioData } from "../context/PortfolioDataContext";
import { downloadResumePdf } from "../lib/resumePdf";

export default function ResumePage() {
  const { data, loading, error } = usePortfolioData();
  const [resumeBusy, setResumeBusy] = useState(false);
  const [resumeError, setResumeError] = useState("");

  const handleDownload = async () => {
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
      <AnimatedSectionHeading kicker="Resume" title={data.resume.title} />

      <article className="detail-card">
        <p className="project-desc">{data.resume.summary}</p>

        <MagneticButton className="btn-primary top-gap" onClick={handleDownload} disabled={resumeBusy}>
          <Download size={15} /> {resumeBusy ? "Generating PDF..." : "Download Resume"}
        </MagneticButton>

        {resumeError ? <p className="resume-error top-gap">{resumeError}</p> : null}

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
