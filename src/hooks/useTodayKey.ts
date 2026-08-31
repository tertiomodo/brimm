import { useEffect, useState } from "react";
import { millisecondsUntilTomorrow, todayKey } from "../utils/date";

const TIMER_MARGIN_MS = 50;

export function useTodayKey(): string {
  const [currentDay, setCurrentDay] = useState(todayKey);

  useEffect(() => {
    let timer: number | undefined;

    function syncDay() {
      setCurrentDay(todayKey());
      window.clearTimeout(timer);
      timer = window.setTimeout(
        syncDay,
        millisecondsUntilTomorrow() + TIMER_MARGIN_MS,
      );
    }

    function syncVisibleDay() {
      if (document.visibilityState === "visible") syncDay();
    }

    syncDay();
    window.addEventListener("focus", syncDay);
    window.addEventListener("pageshow", syncDay);
    document.addEventListener("visibilitychange", syncVisibleDay);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", syncDay);
      window.removeEventListener("pageshow", syncDay);
      document.removeEventListener("visibilitychange", syncVisibleDay);
    };
  }, []);

  return currentDay;
}
