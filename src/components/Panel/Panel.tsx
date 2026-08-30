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
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M14.5 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
