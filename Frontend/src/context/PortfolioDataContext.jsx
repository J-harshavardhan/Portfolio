import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const PortfolioDataContext = createContext(null);
const STORAGE_KEY = "portfolio-admin-content-v1";

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
  suggestedPrompts: [],
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

  const updateDataFromJson = useCallback((jsonText, persist = true) => {
    const parsed = JSON.parse(jsonText);
    const normalized = { ...emptyData, ...parsed };
    setData(normalized);
    setError("");

    if (persist) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized, null, 2));
    }

    return normalized;
  }, []);

  const resetToPublished = useCallback(async () => {
    const published = await fetchPublishedData();
    localStorage.removeItem(STORAGE_KEY);
    setData(published);
    setError("");
    return published;
  }, [fetchPublishedData]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const localValue = localStorage.getItem(STORAGE_KEY);
        if (localValue) {
          const localJson = JSON.parse(localValue);
          if (mounted) {
            setData({ ...emptyData, ...localJson });
            setLoading(false);
          }
          return;
        }

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

  const dataJson = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const value = useMemo(
    () => ({ data, loading, error, dataJson, updateDataFromJson, resetToPublished }),
    [data, loading, error, dataJson, updateDataFromJson, resetToPublished]
  );

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>;
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    throw new Error("usePortfolioData must be used inside PortfolioDataProvider.");
  }
  return context;
}
