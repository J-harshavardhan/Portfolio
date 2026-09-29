import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

const PortfolioDataContext = createContext(null);

const emptyData = {
  profile: {
    name: "",
    role: "",
    location: "",
    email: "",
    photo: "",
    tagline: "",
    summary: "",
    resumeFile: "",
  },
  stats: [],
  links: [],
  projects: [],
  skillGroups: [],
  languageBar: [],
  achievements: [],
  resume: { title: "", summary: "", sections: [] },
};

export function PortfolioDataProvider({ children }) {
  const [data, setData] = useState(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPublishedData = useCallback(async () => {
    const response = await fetch("/content/portfolio.json", { cache: "no-cache" });
    if (!response.ok) {
      throw new Error("Failed to load portfolio content.");
    }
    const json = await response.json();
    return { ...emptyData, ...json };
  }, []);

  React.useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const published = await fetchPublishedData();
        if (mounted) {
          setData(published);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || "Could not load portfolio content.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [fetchPublishedData]);

  const value = useMemo(() => ({ data, loading, error }), [data, loading, error]);

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used inside PortfolioDataProvider.");
  }
  return context;
}
