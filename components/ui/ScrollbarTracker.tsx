"use client";

import { useEffect } from "react";

export function ScrollbarTracker() {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleScroll = () => {
      document.body.classList.add("is-scrolling");
      clearTimeout(timer);
      timer = setTimeout(() => {
        document.body.classList.remove("is-scrolling");
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("scroll", handleScroll, { capture: true, passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", handleScroll, { capture: true });
      clearTimeout(timer);
    };
  }, []);

  return null;
}
