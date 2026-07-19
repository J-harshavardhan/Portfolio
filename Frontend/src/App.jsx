import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { PortfolioDataProvider } from "./context/PortfolioDataContext";
import AchievementsPage from "./pages/AchievementsPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import ResumePage from "./pages/ResumePage";
import SkillsPage from "./pages/SkillsPage";
import "./App.css";

export default function App() {
  return (
    <PortfolioDataProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </PortfolioDataProvider>
  );
}
