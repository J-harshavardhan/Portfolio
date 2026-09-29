import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/projects", label: "Projects" },
  { to: "/achievements", label: "Achievements" },
  { to: "/skills", label: "Skills" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
];

function CursorDot() {
  const dotRef = React.useRef(null);

  React.useEffect(() => {
    const dot = dotRef.current;
    if (!dot || !window.matchMedia("(pointer: fine)").matches) return undefined;

    const move = (event) => {
      dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      dot.classList.add("cursor-dot-visible");
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return <span ref={dotRef} className="cursor-dot" aria-hidden="true" />;
}

export default function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="page-wrap">
      <header className="top-nav">
        <div className="shell nav-inner">
          <Link to="/" className="brand">
            <span className="brand-mark">JH</span>
            <span>J. Harshavardhan</span>
          </Link>

          <nav className="nav-links" aria-label="Main">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === "/"} className="nav-item">
                <span className="nav-label">{item.label}</span>
                {(item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to)) ? (
                  <motion.span className="nav-indicator" layoutId="nav-indicator" />
                ) : null}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="nav-cta">
            Let&apos;s talk <ArrowUpRight size={14} />
          </Link>

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

      <CursorDot />

      <main>
        <Outlet />
      </main>

      <footer className="footer shell">
        <span>J. Harshavardhan</span>
        <span>AI / ML · Full-stack · Product-minded</span>
        <span>{new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
