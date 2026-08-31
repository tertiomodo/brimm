import { useState } from "react";
import { Panel } from "../Panel/Panel";
import styles from "./SettingsPanel.module.css";
import { formatTime } from "../../utils/date";
import type { Serving } from "../../types";

interface Props {
  goal: number;
  total: number;
  servings: Serving[];
  yesterdayTotal: number | null;
  onGoalChange: (goal: number) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function SettingsPanel({
  goal,
  total,
  servings,
  yesterdayTotal,
  onGoalChange,
  onRemove,
  onClose,
}: Props) {
  const [draft, setDraft] = useState(String(goal));

  function commitGoal() {
    const next = Math.round(Number(draft));
    if (next >= 200 && next <= 10000) onGoalChange(next);
    else setDraft(String(goal));
  }

  return (
    <Panel title="Settings" onClose={onClose}>
      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.group}>
            <div className={styles.row}>
              <span className={styles.label}>Daily goal</span>
              <label className={styles.goalField}>
                <input
                  className={styles.goalInput}
                  type="number"
                  inputMode="numeric"
                  min={200}
                  max={10000}
                  step={50}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.target as HTMLInputElement).blur()
                  }
                  onBlur={commitGoal}
                  aria-label="Daily goal, ml"
                />
                <span className={styles.unit}>ml</span>
              </label>
            </div>
          </div>
          <p className={styles.footnote}>
            Your progress on the main screen is measured against this.
          </p>
        </section>

        <section className={styles.section}>
          <div className={styles.caption}>
            <h3 className={styles.captionTitle}>Today</h3>
            <p className={styles.captionValue}>
              <strong className={styles.captionAccent}>{total}</strong> / {goal}{" "}
              ml
            </p>
          </div>

          <div className={styles.group}>
            {servings.length === 0 ? (
              <p className={styles.empty}>Nothing logged yet</p>
            ) : (
              [...servings].reverse().map((serving) => (
                <div key={serving.id} className={styles.row}>
                  <span className={styles.time}>{formatTime(serving.time)}</span>
                  <span className={styles.amount}>{serving.amount} ml</span>
                  <button
                    className={styles.remove}
                    onClick={() => onRemove(serving.id)}
                    aria-label={`Remove ${serving.amount} ml logged at ${formatTime(serving.time)}`}
                  >
                    <span className={styles.removeIcon} aria-hidden />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.caption}>
            <h3 className={styles.captionTitle}>History</h3>
          </div>
          <div className={styles.group}>
            <div className={styles.row}>
              <span className={styles.label}>Yesterday</span>
              <span className={styles.value}>
                {yesterdayTotal ?? 0} ml
              </span>
            </div>
          </div>
        </section>
      </div>
    </Panel>
  );
}
