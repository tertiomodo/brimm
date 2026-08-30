import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from "react";
import styles from "./Panel.module.css";

const AXIS_LOCK = 10;
const CLOSE_DISTANCE = 80;
const CLOSE_VELOCITY = 0.5;
const CLOSE_DURATION = 260;

type Phase = "enter" | "open" | "closing";

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function Panel({ title, onClose, children }: Props) {
  const start = useRef<{ x: number; y: number; time: number } | null>(null);
  const axis = useRef<"none" | "x" | "y">("none");
  const closeTimer = useRef<number>();
  const [phase, setPhase] = useState<Phase>("enter");
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("open"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      clearTimeout(closeTimer.current);
    };
  }, []);

  function close() {
    if (phase === "closing") return;
    setDragging(false);
    setPhase("closing");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimer.current = window.setTimeout(onClose, reduced ? 0 : CLOSE_DURATION);
  }

  function handleTouchStart(e: TouchEvent) {
    if (phase !== "open" || e.touches.length !== 1) return;
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
    axis.current = "none";

    const velocity = offset / Math.max(1, Date.now() - from.time);
    setDragging(false);

    if (offset > CLOSE_DISTANCE || velocity > CLOSE_VELOCITY) close();
    else setOffset(0);
  }

  return (
    <div
      className={styles.panel}
      role="dialog"
      aria-label={title}
      data-phase={phase}
      data-dragging={dragging || undefined}
      style={{
        transform: phase === "open" ? `translateX(${offset}px)` : "translateX(100%)",
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <header className={styles.header}>
        <button className={styles.back} onClick={close} aria-label="Back">
          <span className={styles.backIcon} aria-hidden />
        </button>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </div>
  );
}
