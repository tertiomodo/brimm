import { useEffect, useRef, useState } from "react";
import styles from "./AmountSheet.module.css";

const PRESETS = [200, 250, 330, 500];

interface Props {
  value: number;
  onSelect: (amount: number) => void;
  onClose: () => void;
}

export function AmountSheet({ value, onSelect, onClose }: Props) {
  const [custom, setCustom] = useState(
    PRESETS.includes(value) ? "" : String(value),
  );
  const customRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function commitCustom() {
    const amount = Math.round(Number(custom));
    if (amount >= 10 && amount <= 3000) onSelect(amount);
    else onClose();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.sheet}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Glass size"
      >
        <p className={styles.title}>Glass size</p>
        {PRESETS.map((amount) => (
          <button
            key={amount}
            className={styles.row}
            data-active={amount === value || undefined}
            onClick={() => onSelect(amount)}
          >
            <span>{amount} ml</span>
            {amount === value && <Check />}
          </button>
        ))}
        <div className={styles.row} onClick={() => customRef.current?.focus()}>
          <label className={styles.customLabel} htmlFor="custom-amount">
            Custom
          </label>
          <span className={styles.customField}>
            <input
              id="custom-amount"
              ref={customRef}
              className={styles.customInput}
              type="number"
              inputMode="numeric"
              min={10}
              max={3000}
              placeholder="—"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && commitCustom()}
              onBlur={() => custom !== "" && commitCustom()}
            />
            ml
          </span>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg className={styles.check} viewBox="0 0 20 20" aria-hidden>
      <path
        d="M4 10.5l4 4 8-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
