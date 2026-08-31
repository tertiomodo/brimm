import { useCallback, useState } from "react";
import type { AppData, DayRecord } from "../types";
import { loadData, saveData } from "../utils/storage";
import { previousDayKey, todayKey } from "../utils/date";
import { useTodayKey } from "./useTodayKey";

function emptyRecord(date: string): DayRecord {
  return { date, total: 0, servings: [] };
}

export function useWaterTracker() {
  const [data, setData] = useState<AppData>(loadData);
  const today = useTodayKey();

  const update = useCallback((fn: (prev: AppData) => AppData) => {
    setData((prev) => {
      const next = fn(prev);
      saveData(next);
      return next;
    });
  }, []);

  const todayRecord = data.records[today] ?? emptyRecord(today);
  const yesterdayTotal = data.records[previousDayKey(today)]?.total ?? null;

  const addServing = useCallback(
    (amount: number) => {
      update((prev) => {
        const currentDay = todayKey();
        const rec = prev.records[currentDay] ?? emptyRecord(currentDay);
        return {
          ...prev,
          records: {
            ...prev.records,
            [currentDay]: {
              ...rec,
              total: rec.total + amount,
              servings: [
                ...rec.servings,
                {
                  id: crypto.randomUUID(),
                  time: new Date().toISOString(),
                  amount,
                },
              ],
            },
          },
        };
      });
    },
    [update],
  );

  const removeServing = useCallback(
    (id: string) => {
      update((prev) => {
        const rec = prev.records[today];
        if (!rec) return prev;
        const servings = rec.servings.filter((s) => s.id !== id);
        return {
          ...prev,
          records: {
            ...prev.records,
            [today]: {
              ...rec,
              total: servings.reduce((sum, s) => sum + s.amount, 0),
              servings,
            },
          },
        };
      });
    },
    [today, update],
  );

  const setGoal = useCallback(
    (goal: number) => {
      update((prev) => ({ ...prev, goal }));
    },
    [update],
  );

  const setServingSize = useCallback(
    (servingSize: number) => {
      update((prev) => ({ ...prev, servingSize }));
    },
    [update],
  );

  const addSize = useCallback(
    (amount: number) => {
      update((prev) =>
        prev.sizes.includes(amount)
          ? prev
          : { ...prev, sizes: [...prev.sizes, amount] },
      );
    },
    [update],
  );

  const removeSize = useCallback(
    (amount: number) => {
      update((prev) => {
        const sizes = prev.sizes.filter((s) => s !== amount);
        if (prev.servingSize !== amount || sizes.length === 0)
          return { ...prev, sizes };
        const nearest = sizes.reduce((best, s) =>
          Math.abs(s - amount) < Math.abs(best - amount) ? s : best,
        );
        return { ...prev, sizes, servingSize: nearest };
      });
    },
    [update],
  );

  const setAlertsOn = useCallback(
    (alertsOn: boolean) => {
      update((prev) => ({ ...prev, alertsOn }));
    },
    [update],
  );

  return {
    data,
    todayRecord,
    yesterdayTotal,
    addServing,
    removeServing,
    setGoal,
    setServingSize,
    addSize,
    removeSize,
    setAlertsOn,
  };
}
