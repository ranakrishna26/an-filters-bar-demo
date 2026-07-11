import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  variant?: 'soft-grey' | 'soft-yellow';
  onClear?: () => void;
  clearLabel?: string;
}

export function Chip({
  children,
  variant = 'soft-grey',
  onClear,
  clearLabel = 'Clear',
}: ChipProps) {
  return (
    <span className={`an-chip an-chip--${variant}`}>
      <span className="an-chip__label">{children}</span>
      {onClear && (
        <button
          type="button"
          className="an-chip__clear"
          aria-label={clearLabel}
          onClick={(event) => {
            event.stopPropagation();
            onClear();
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
