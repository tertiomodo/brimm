import { useEffect } from "react";

const INTERVAL_MS = 60 * 60 * 1000;

export function useReminders(enabled: boolean, goalReached: boolean) {
  useEffect(() => {
    if (!enabled || goalReached) return;
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }

    const timer = setInterval(() => {
      if (Notification.permission !== "granted") return;
      new Notification("Time for a glass of water", {
        body: "Tap to log it in Brimm.",
      });
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [enabled, goalReached]);
}
