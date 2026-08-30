import glass from "./img/glass.svg";
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
      <img className={styles.icon} src={glass} alt="" />
    </button>
  );
}
