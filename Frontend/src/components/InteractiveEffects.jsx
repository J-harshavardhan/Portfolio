import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";

export function useMotionPreferences() {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return { prefersReducedMotion, isMobile };
}

export function AnimatedSectionHeading({ kicker, title, className = "" }) {
  const prefersReducedMotion = useReducedMotion();
  const words = useMemo(() => title.split(/\s+/).filter(Boolean), [title]);

  return (
    <div className={`section-head ${className}`.trim()}>
      {kicker ? <p className="section-kicker">{kicker}</p> : null}
      {prefersReducedMotion ? (
        <h2>{title}</h2>
      ) : (
        <motion.h2
          aria-label={title}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
          }}
        >
          {words.map((word, index) => (
            <motion.span
              key={`${word}-${index}`}
              className="reveal-word"
              variants={{
                hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
                show: { opacity: 1, y: 0, filter: "blur(0px)" },
              }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>
      )}
    </div>
  );
}

function useCountUp(targetValue, isVisible) {
  const prefersReducedMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) {
      setValue(targetValue);
      return;
    }

    let raf = 0;
    const duration = 1100;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(targetValue * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    setValue(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, prefersReducedMotion, targetValue]);

  return value;
}

function formatStatValue(rawValue, animatedValue) {
  const numeric = Number(String(rawValue).replace(/[^\d.]/g, ""));
  const decimals = String(rawValue).includes(".") ? String(rawValue).split(".")[1].replace(/\D/g, "").length : 0;
  const suffix = String(rawValue).replace(/[\d.]/g, "");

  if (!Number.isFinite(numeric)) {
    return String(rawValue);
  }

  const formatted = animatedValue.toFixed(decimals).replace(/\.0+$/, "");
  return `${formatted}${suffix}`;
}

export function AnimatedStatTile({ label, value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.6 });
  const prefersReducedMotion = useReducedMotion();
  const numericValue = Number(String(value).replace(/[^\d.]/g, ""));
  const animatedValue = useCountUp(Number.isFinite(numericValue) ? numericValue : 0, isInView);

  return (
    <motion.article
      ref={ref}
      className="stat-tile interactive-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.45 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      transformTemplate={(generated) => `${generated} rotateX(var(--card-tilt-x, 0deg)) rotateY(var(--card-tilt-y, 0deg))`}
      style={prefersReducedMotion ? undefined : { "--card-tilt-x": "0deg", "--card-tilt-y": "0deg" }}
    >
      <p className="stat-value">{formatStatValue(value, animatedValue)}</p>
      <p className="stat-label">{label}</p>
    </motion.article>
  );
}

function updateCardPointerVariables(event) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const tiltX = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
  const tiltY = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
  element.style.setProperty("--spotlight-x", `${x}%`);
  element.style.setProperty("--spotlight-y", `${y}%`);
  element.style.setProperty("--card-tilt-x", `${tiltX}deg`);
  element.style.setProperty("--card-tilt-y", `${tiltY}deg`);
  element.style.setProperty("--spotlight-opacity", "1");
}

function resetCardPointerVariables(event) {
  const element = event.currentTarget;
  element.style.setProperty("--card-tilt-x", "0deg");
  element.style.setProperty("--card-tilt-y", "0deg");
  element.style.setProperty("--spotlight-opacity", "0");
}

export function InteractiveCard({ as = "article", className = "", children, animate = true, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      className={`interactive-card ${className}`.trim()}
      onPointerMove={prefersReducedMotion ? undefined : updateCardPointerVariables}
      onPointerLeave={prefersReducedMotion ? undefined : resetCardPointerVariables}
      initial={animate ? { opacity: 0, y: 18 } : false}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true, amount: 0.3 } : undefined}
      transition={{ duration: 0.45, ease: "easeOut" }}
      transformTemplate={(generated) => `${generated} rotateX(var(--card-tilt-x, 0deg)) rotateY(var(--card-tilt-y, 0deg))`}
      {...props}
    >
      {children}
    </MotionTag>
  );
}

function createRipple(event, setRipples) {
  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const size = Math.max(rect.width, rect.height) * 1.6;
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  setRipples((current) => [...current, { id, x, y, size }]);
  window.setTimeout(() => {
    setRipples((current) => current.filter((ripple) => ripple.id !== id));
  }, 650);
}

export function MagneticButton({ to, href, onClick, className = "", children, ...props }) {
  const prefersReducedMotion = useReducedMotion();
  const [ripples, setRipples] = useState([]);
  const MotionLink = motion(Link);
  const MotionAnchor = motion.a;
  const MotionButton = motion.button;

  const sharedProps = {
    className: `btn magnetic-control ${className}`.trim(),
    onPointerMove: prefersReducedMotion
      ? undefined
      : (event) => {
          const element = event.currentTarget;
          const rect = element.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 14;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 14;
          element.style.setProperty("--magnetic-x", `${x}px`);
          element.style.setProperty("--magnetic-y", `${y}px`);
        },
    onPointerLeave: prefersReducedMotion
      ? undefined
      : (event) => {
          const element = event.currentTarget;
          element.style.setProperty("--magnetic-x", "0px");
          element.style.setProperty("--magnetic-y", "0px");
        },
    onPointerDown: prefersReducedMotion ? undefined : (event) => createRipple(event, setRipples),
    onClick,
    style: prefersReducedMotion ? undefined : { "--magnetic-x": "0px", "--magnetic-y": "0px" },
    transformTemplate: (generated) => `${generated} translate3d(var(--magnetic-x, 0px), var(--magnetic-y, 0px), 0)`,
    ...props,
  };

  const rippleNodes = ripples.map((ripple) => (
    <span
      key={ripple.id}
      className="button-ripple"
      style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
    />
  ));

  if (to) {
    return (
      <MotionLink to={to} {...sharedProps} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
        {children}
        {rippleNodes}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <MotionAnchor href={href} {...sharedProps} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
        {children}
        {rippleNodes}
      </MotionAnchor>
    );
  }

  return (
    <MotionButton type="button" {...sharedProps} whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}>
      {children}
      {rippleNodes}
    </MotionButton>
  );
}
