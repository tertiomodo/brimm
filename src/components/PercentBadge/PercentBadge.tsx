import styles from "./PercentBadge.module.css";

interface Props {
  percent: number;
  delta: number | null;
}

export function PercentBadge({ percent, delta }: Props) {
  return (
    <div className={styles.wrap}>
      <div className={styles.badge}>
        <span className={styles.value}>{percent}%</span>
      </div>
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
