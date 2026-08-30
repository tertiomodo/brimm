import { Panel } from '../Panel/Panel';
import rows from '../Panel/rows.module.css';
import styles from './HistoryPanel.module.css';
import { formatTime } from '../../utils/date';
import type { Serving } from '../../types';

interface Props {
  servings: Serving[];
  total: number;
  goal: number;
  yesterdayTotal: number | null;
  onRemove: (id: string) => void;
  onClose: () => void;
}

export function HistoryPanel({ servings, total, goal, yesterdayTotal, onRemove, onClose }: Props) {
  return (
    <Panel title="Today" onClose={onClose}>
      <div className={styles.summary}>
        <strong className={styles.total}>{total}</strong>
        <span className={styles.of}>of {goal} ml</span>
      </div>

      {servings.length === 0 ? (
        <p className={rows.empty}>No water logged yet today.</p>
      ) : (
        <ul className={styles.list}>
          {[...servings].reverse().map(serving => (
            <li key={serving.id} className={rows.row}>
              <span className={rows.muted}>{formatTime(serving.time)}</span>
              <span className={styles.amount}>{serving.amount} ml</span>
              <button
                className={styles.remove}
                onClick={() => onRemove(serving.id)}
                aria-label={`Remove ${serving.amount} ml`}
              >
                <svg viewBox="0 0 20 20" aria-hidden>
                  <path d="M6 6l8 8M14 6l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className={styles.yesterday}>
        <span className={rows.label}>Yesterday</span>
        <span className={rows.muted}>
          {yesterdayTotal !== null ? `${yesterdayTotal} ml` : '—'}
        </span>
      </div>
    </Panel>
  );
}
