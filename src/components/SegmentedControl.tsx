interface SegmentOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  value: T;
  options: readonly SegmentOption<T>[] | readonly T[];
  onChange: (value: T) => void;
  ariaLabel?: string;
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  ariaLabel = 'Options',
}: SegmentedControlProps<T>) {
  const normalized = options.map((option) =>
    typeof option === 'string'
      ? { value: option, label: option }
      : option,
  );

  return (
    <div
      className="an-segmented-control"
      role="radiogroup"
      aria-label={ariaLabel}
    >
      {normalized.map((option) => {
        const checked = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            className={`an-segment${checked ? ' an-segment--selected' : ''}`}
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
