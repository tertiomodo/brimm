import type { ReactNode } from "react";
import styles from "./Panel.module.css";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Panel({ title, onClose, children }: Props) {
  return (
    <div className={styles.panel} role="dialog" aria-label={title}>
      <header className={styles.header}>
        <button className={styles.back} onClick={onClose} aria-label="Back">
          <span className={styles.backIcon} aria-hidden />
        </button>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
