import styles from "./AddButton.module.css";

interface Props {
  onClick: () => void;
}

export function AddButton({ onClick }: Props) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
      aria-label="Add a glass of water"
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
        <path
          d="M4.9 3.2h14.2l-1.6 15.9a3.4 3.4 0 0 1-3.38 3.06h-4.24A3.4 3.4 0 0 1 6.5 19.1L4.9 3.2z"
          fill="currentColor"
        />
        <path
          d="M6.35 10.4c1.05 0 1.6-.85 2.8-.85s1.75.85 2.85.85 1.65-.85 2.85-.85c.6 0 1 .22 1.4.45l-.18 1.85c-.4-.22-.68-.4-1.22-.4-1.2 0-1.75.85-2.85.85s-1.8-.85-2.85-.85-1.65.85-2.7.85c-.06 0-.12 0-.18-.01l-.18-1.9c.09-.01.17-.02.26-.02z"
          fill="var(--empty)"
        />
      </svg>
    </button>
  );
}
