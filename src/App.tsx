import { useRef, useState } from "react";
import { useWaterTracker } from "./hooks/useWaterTracker";
// import { useReminders } from "./hooks/useReminders";
import { WaterGlass } from "./components/WaterGlass/WaterGlass";
import { PercentBadge } from "./components/PercentBadge/PercentBadge";
import { AddButton } from "./components/AddButton/AddButton";
import { AmountSheet } from "./components/AmountSheet/AmountSheet";
import { SettingsPanel } from "./components/SettingsPanel/SettingsPanel";
import { HistoryPanel } from "./components/HistoryPanel/HistoryPanel";
import styles from "./App.module.css";

type Screen = "glass" | "settings" | "history";

export function App() {
  const {
    data,
    todayRecord,
    yesterdayTotal,
    addServing,
    removeServing,
    setGoal,
    setServingSize,
    addSize,
    removeSize,
    // setAlertsOn,
  } = useWaterTracker();

  const [screen, setScreen] = useState<Screen>("glass");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [delta, setDelta] = useState<number | null>(null);
  const deltaTimer = useRef<number>();

  const percent = Math.round((todayRecord.total / data.goal) * 100);
  const level = Math.min(1, todayRecord.total / data.goal);

  // useReminders(data.alertsOn, level >= 1);

  function handleAdd() {
    addServing(data.servingSize);
    setDelta(data.servingSize);
    clearTimeout(deltaTimer.current);
    deltaTimer.current = window.setTimeout(() => setDelta(null), 1600);
  }

  function handleSelectAmount(amount: number) {
    setServingSize(amount);
    setSheetOpen(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.glass}>
        <WaterGlass level={level} />

        <button
          className={styles.settingsBtn}
          onClick={() => setScreen("settings")}
          aria-label="Settings"
        >
          <span className={styles.settingsIcon} aria-hidden />
        </button>

        <div className={styles.badgeSlot}>
          <PercentBadge
            percent={percent}
            delta={delta}
            onOpenHistory={() => setScreen("history")}
          />
        </div>

        <div className={styles.actions}>
          <AddButton onClick={handleAdd} />
          <button className={styles.hint} onClick={() => setSheetOpen(true)}>
            Tap to add {data.servingSize} ml
            <span className={styles.chevron} aria-hidden />
          </button>
        </div>

        {sheetOpen && (
          <AmountSheet
            value={data.servingSize}
            sizes={data.sizes}
            onSelect={handleSelectAmount}
            onAddSize={addSize}
            onRemoveSize={removeSize}
            onClose={() => setSheetOpen(false)}
          />
        )}

        {screen === "settings" && (
          <SettingsPanel
            goal={data.goal}
            // alertsOn={data.alertsOn}
            onGoalChange={setGoal}
            // onAlertsChange={setAlertsOn}
            onClose={() => setScreen("glass")}
          />
        )}

        {screen === "history" && (
          <HistoryPanel
            servings={todayRecord.servings}
            total={todayRecord.total}
            goal={data.goal}
            yesterdayTotal={yesterdayTotal}
            onRemove={removeServing}
            onClose={() => setScreen("glass")}
          />
        )}
      </div>
    </div>
  );
}
