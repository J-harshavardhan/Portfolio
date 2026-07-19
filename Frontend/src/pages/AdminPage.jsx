import React, { useEffect, useState } from "react";
import { Download, RefreshCcw, Upload } from "lucide-react";
import { usePortfolioData } from "../context/PortfolioDataContext";

export default function AdminPage() {
  const { dataJson, loading, error, resetToPublished, updateDataFromJson } = usePortfolioData();
  const [editorValue, setEditorValue] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    if (!isDirty) {
      setEditorValue(dataJson);
    }
  }, [dataJson, isDirty]);

  if (loading) {
    return (
      <section className="shell section visible page-intro-space">
        <p className="state-text">Loading admin editor...</p>
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

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(editorValue);
      setEditorValue(JSON.stringify(parsed, null, 2));
      setStatus("JSON formatted successfully.");
      setStatusError("");
      setIsDirty(true);
    } catch {
      setStatus("");
      setStatusError("Invalid JSON format. Fix syntax before formatting.");
    }
  };

  const handleApply = () => {
    try {
      updateDataFromJson(editorValue, true);
      setStatus("Changes applied and saved in browser storage.");
      setStatusError("");
      setIsDirty(false);
    } catch {
      setStatus("");
      setStatusError("Could not apply changes. JSON is invalid.");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([editorValue], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio.json";
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Downloaded edited JSON file.");
    setStatusError("");
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      JSON.parse(text);
      setEditorValue(text);
      setIsDirty(true);
      setStatus("Imported JSON file. Review and click Apply Changes.");
      setStatusError("");
    } catch {
      setStatus("");
      setStatusError("Imported file is not valid JSON.");
    }
  };

  const handleReset = async () => {
    try {
      await resetToPublished();
      setStatus("Reset to published content from /public/content/portfolio.json.");
      setStatusError("");
      setIsDirty(false);
    } catch {
      setStatus("");
      setStatusError("Could not reset published content.");
    }
  };

  return (
    <section className="shell section visible page-intro-space">
      <div className="section-head">
        <p className="section-kicker">Admin</p>
        <h2>Portfolio JSON Manager</h2>
      </div>

      <p className="about-copy">
        Edit all profile, project, achievement, and skills content from this page. Changes are saved in this
        browser using local storage. Use Download to export your JSON, then replace
        /public/content/portfolio.json when you want permanent deployment.
      </p>

      <div className="admin-toolbar top-gap">
        <button type="button" className="btn btn-primary" onClick={handleApply}>
          Apply Changes
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleFormat}>
          Format JSON
        </button>
        <button type="button" className="btn btn-ghost" onClick={handleDownload}>
          <Download size={15} /> Download JSON
        </button>
        <label className="btn btn-ghost upload-btn">
          <Upload size={15} /> Import JSON
          <input type="file" accept="application/json" onChange={handleImport} />
        </label>
        <button type="button" className="btn btn-ghost" onClick={handleReset}>
          <RefreshCcw size={15} /> Reset Published
        </button>
      </div>

      {status && <p className="admin-status top-gap">{status}</p>}
      {statusError && <p className="admin-status admin-error top-gap">{statusError}</p>}

      <textarea
        className="json-editor top-gap"
        value={editorValue}
        onChange={(e) => {
          setEditorValue(e.target.value);
          setIsDirty(true);
        }}
        spellCheck={false}
        aria-label="Portfolio JSON editor"
      />
    </section>
  );
}
