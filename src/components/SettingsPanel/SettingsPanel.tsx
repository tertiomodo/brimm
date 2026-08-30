import { useState } from 'react';
import { Panel } from '../Panel/Panel';
import rows from '../Panel/rows.module.css';
import styles from './SettingsPanel.module.css';

interface Props {
  goal: number;
  alertsOn: boolean;
  onGoalChange: (goal: number) => void;
  onAlertsChange: (on: boolean) => void;
  onClose: () => void;
}

export function SettingsPanel({ goal, alertsOn, onGoalChange, onAlertsChange, onClose }: Props) {
  const [draft, setDraft] = useState(String(goal));

  function commitGoal() {
    const next = Math.round(Number(draft));
    if (next >= 200 && next <= 10000) onGoalChange(next);
    else setDraft(String(goal));
  }

  return (
    <Panel title="General" onClose={onClose}>
      <div className={rows.row}>
        <span className={rows.label}>Goal of the day</span>
        <span className={styles.goalField}>
          <input
            className={styles.goalInput}
            type="number"
            inputMode="numeric"
            min={200}
            max={10000}
            step={50}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
            onBlur={commitGoal}
            aria-label="Goal of the day, ml"
          />
          ml
        </span>
      </div>

      <div className={rows.row}>
        <span className={rows.label}>Alert on</span>
        <button
          className={styles.toggle}
          role="switch"
          aria-checked={alertsOn}
          aria-label="Alert on"
          onClick={() => onAlertsChange(!alertsOn)}
        >
          <span className={styles.knob} />
        </button>
      </div>

      {alertsOn && (
        <p className={styles.note}>
          A reminder every hour while the app stays open, until the goal is reached.
        </p>
      )}
    </Panel>
  );
}
