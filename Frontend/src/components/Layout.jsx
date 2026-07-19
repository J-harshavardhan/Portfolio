import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/achievements", label: "Achievements" },
  { to: "/skills", label: "Skills" },
  { to: "/resume", label: "Resume" },
  { to: "/admin", label: "Admin" },
  { to: "/contact", label: "Contact" },
];

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="page-wrap">
      <header className="top-nav">
        <div className="shell nav-inner">
          <Link to="/" className="brand">
            J. Harshavardhan
          </Link>

          <nav className="nav-links" aria-label="Main">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            className="menu-toggle"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle navigation"
            type="button"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {isOpen && (
          <div className="mobile-nav shell">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer shell">Built with React and FastAPI - {new Date().getFullYear()}</footer>
    </div>
  );
}
