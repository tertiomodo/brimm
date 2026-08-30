import styles from "./PercentBadge.module.css";

interface Props {
  percent: number;
  delta: number | null;
  onOpenHistory: () => void;
}

export function PercentBadge({ percent, delta, onOpenHistory }: Props) {
  return (
    <div className={styles.wrap}>
      <button
        className={styles.badge}
        onClick={onOpenHistory}
        aria-label="Open today's log"
      >
        <span className={styles.value}>{percent}%</span>
      </button>
      <span
        className={styles.delta}
        key={delta ?? "idle"}
        data-visible={delta !== null || undefined}
      >
        {delta !== null ? `+${delta} ml` : ""}
      </span>
    </div>
  );
}
