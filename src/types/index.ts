export interface Serving {
  id: string;
  time: string;
  amount: number;
}

export interface DayRecord {
  date: string;
  total: number;
  servings: Serving[];
}

export interface AppData {
  goal: number;
  servingSize: number;
  sizes: number[];
  alertsOn: boolean;
  records: Record<string, DayRecord>;
}
