import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

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