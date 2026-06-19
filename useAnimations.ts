import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Ajoute/retire la classe "visible" sur les éléments ".reveal"
 * à chaque fois qu'ils entrent ou sortent du viewport.
 * Les animations se rejouent donc aussi bien quand on descend
 * que quand on remonte la page.
 */
export function useScrollReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // IntersectionObserver indisponible -> on laisse tout visible.
    if (typeof IntersectionObserver === "undefined") return;

    // Active le mode "masquage avant animation" uniquement maintenant
    // que JS tourne : si JS plante, le contenu reste visible.
    document.documentElement.classList.add("reveal-ready");

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            // Re‑arme l'animation lorsque l'élément quitte l'écran,
            // afin qu'elle se rejoue au prochain passage (haut ou bas).
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );

    // Re‑scan périodique léger pour capter les éléments montés après coup
    // (sections conditionnelles, etc.).
    const observeAll = () => {
      document.querySelectorAll(".reveal:not([data-observed])").forEach((el) => {
        el.setAttribute("data-observed", "true");
        observerRef.current?.observe(el);
      });
    };
    observeAll();
    const id = window.setTimeout(observeAll, 300);

    return () => {
      window.clearTimeout(id);
      observerRef.current?.disconnect();
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);
}

/**
 * Compteur animé de 0 jusqu'à `to`. Retourne la valeur actuelle.
 */
export function useCountUp(to: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.floor(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, to, duration]);

  const trigger = useCallback(() => setStarted(true), []);
  return { value, trigger };
}
