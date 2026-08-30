import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import styles from "./Panel.module.css";

const AXIS_LOCK = 10;
const CLOSE_DISTANCE = 80;
const CLOSE_VELOCITY = 0.5;
const CLOSE_DURATION = 220;

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Panel({ title, onClose, children }: Props) {
  const start = useRef<{ x: number; y: number; time: number } | null>(null);
  const axis = useRef<"none" | "x" | "y">("none");
  const closing = useRef(false);
  const closeTimer = useRef<number>();
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  function handleTouchStart(e: TouchEvent) {
    if (closing.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    start.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    axis.current = "none";
  }

  function handleTouchMove(e: TouchEvent) {
    if (!start.current) return;
    const dx = e.touches[0].clientX - start.current.x;
    const dy = e.touches[0].clientY - start.current.y;

    if (axis.current === "none") {
      if (Math.abs(dx) < AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        axis.current = "y";
        start.current = null;
        return;
      }
      axis.current = "x";
      setDragging(true);
    }

    setOffset(Math.max(0, dx));
  }

  function handleTouchEnd() {
    const from = start.current;
    start.current = null;
    if (axis.current !== "x" || !from) return;

    const velocity = offset / Math.max(1, Date.now() - from.time);
    setDragging(false);

    if (offset > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) {
      closing.current = true;
      setOffset(window.innerWidth);
      closeTimer.current = window.setTimeout(onClose, CLOSE_DURATION);
    } else {
      setOffset(0);
    }
  }

  return (
    <div
      className={styles.panel}
      role="dialog"
      aria-label={title}
      data-dragging={dragging || undefined}
      style={offset ? { transform: `translateX(${offset}px)` } : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
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
