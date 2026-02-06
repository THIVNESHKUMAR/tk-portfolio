import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTE_ORDER } from "./fullpageRoutes";

export function useWheelRouteNav(enabled = true) {
  const nav = useNavigate();
  const loc = useLocation();
  const lockRef = useRef(false);
  const lastRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const onWheel = (e) => {
      // Ignore trackpad horizontal scroll, pinch zoom, and small deltas
      if (e.ctrlKey) return;
      const now = Date.now();
      if (now - lastRef.current < 700) return;

      // lock to avoid rapid triggers
      if (lockRef.current) return;

      const dy = e.deltaY;
      if (Math.abs(dy) < 40) return;

      e.preventDefault();

      const idx = ROUTE_ORDER.indexOf(loc.pathname);
      if (idx === -1) return;

      const dir = dy > 0 ? 1 : -1;
      const next = ROUTE_ORDER[idx + dir];
      if (!next) return;

      lockRef.current = true;
      lastRef.current = now;

      nav(next);

      // release lock after animation time
      setTimeout(() => {
        lockRef.current = false;
      }, 700);
    };

    // Important: non-passive to allow preventDefault
    window.addEventListener("wheel", onWheel, { passive: false });

    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled, nav, loc.pathname]);
}
