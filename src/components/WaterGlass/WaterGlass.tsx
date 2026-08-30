import styles from "./WaterGlass.module.css";

interface Props {
  level: number;
}

const WAVE_PATH =
  "M0,30 C90,4 180,4 270,30 C360,56 450,56 540,30 C630,4 720,4 810,30 " +
  "C900,56 990,56 1080,30 L1080,80 L0,80 Z";

export function WaterGlass({ level }: Props) {
  return (
    <div
      className={styles.water}
      style={{ height: `${level * 100}%` }}
      aria-hidden
    >
      <div className={styles.waves}>
        <svg
          className={`${styles.wave} ${styles.waveBack}`}
          viewBox="0 0 1080 80"
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH} />
        </svg>
        <svg
          className={`${styles.wave} ${styles.waveFront}`}
          viewBox="0 0 1080 80"
          preserveAspectRatio="none"
        >
          <path d={WAVE_PATH} />
        </svg>
      </div>
    </div>
  );
}
