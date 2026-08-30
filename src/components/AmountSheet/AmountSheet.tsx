import { useEffect, useRef, useState } from "react";
import styles from "./AmountSheet.module.css";

interface Props {
  value: number;
  sizes: number[];
  onSelect: (amount: number) => void;
  onAddSize: (amount: number) => void;
  onRemoveSize: (amount: number) => void;
  onClose: () => void;
}

export function AmountSheet({
  value,
  sizes,
  onSelect,
  onAddSize,
  onRemoveSize,
  onClose,
}: Props) {
  const sorted = [...sizes].sort((a, b) => a - b);
  const [custom, setCustom] = useState(
    sizes.includes(value) ? "" : String(value),
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
    if (amount < 10 || amount > 3000) {
      onClose();
      return;
    }
    onAddSize(amount);
    onSelect(amount);
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
        {sorted.map((amount) => (
          <div key={amount} className={styles.rowGroup}>
            <button
              className={styles.row}
              data-active={amount === value || undefined}
              onClick={() => onSelect(amount)}
            >
              <span>{amount} ml</span>
              {amount === value && <Check />}
            </button>
            <button
              className={styles.remove}
              onClick={() => onRemoveSize(amount)}
              aria-label={`Remove ${amount} ml`}
            >
              <span className={styles.removeIcon} aria-hidden />
            </button>
          </div>
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
    <span className={styles.check} aria-hidden />
  );
}
