import type { AppData } from "../types";

const KEY = "brimm_data";

const DEFAULTS: AppData = {
  goal: 2000,
  servingSize: 250,
  sizes: [200, 250, 330, 500],
  alertsOn: false,
  records: {},
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<AppData>;
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}
