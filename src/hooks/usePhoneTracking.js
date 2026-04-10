import { useEffect } from "react";

const COUNTER_ID = 108261216;

const usePhoneTracking = () => {
  useEffect(() => {
    const handleClick = (e) => {
      const target = e.target.closest('a[href^="tel:"]');
      if (!target) return;
      if (typeof window.ym === "function") {
        window.ym(COUNTER_ID, "reachGoal", "phone_click");
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);
};

export default usePhoneTracking;
