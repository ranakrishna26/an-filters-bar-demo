import { useEffect, useState } from 'react';
import { Chip } from './Chip';
import { OutlinedSelect } from './OutlinedSelect';

interface MultiSelectFilterProps {
  id: string;
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resetSignal: number;
  matchTriggerListWidth?: boolean;
  width?: 'wide' | 'select' | 'narrow' | 'auto';
}

export function MultiSelectFilter({
  label,
  options,
  selected,
  onChange,
  open,
  onOpenChange,
  resetSignal,
  matchTriggerListWidth = true,
  width = 'wide',
}: MultiSelectFilterProps) {
  const [localSelected, setLocalSelected] = useState(selected);

  useEffect(() => {
    setLocalSelected(selected);
  }, [selected, resetSignal]);

  const allSelected =
    options.length > 0 && localSelected.length === options.length;
  const chipLabel =
    localSelected.length === 0
      ? null
      : allSelected
        ? 'All'
        : String(localSelected.length);

  const toggle = (option: string) => {
    const next = localSelected.includes(option)
      ? localSelected.filter((item) => item !== option)
      : [...localSelected, option];
    setLocalSelected(next);
    onChange(next);
  };

  const toggleAll = () => {
    const next = allSelected ? [] : [...options];
    setLocalSelected(next);
    onChange(next);
  };

  return (
    <OutlinedSelect
      label={label}
      open={open}
      onOpenChange={onOpenChange}
      width={width}
      matchMenuWidth={matchTriggerListWidth}
      chip={
        chipLabel ? (
          <Chip
            onClear={() => {
              setLocalSelected([]);
              onChange([]);
            }}
            clearLabel={`Clear ${label}`}
          >
            {chipLabel}
          </Chip>
        ) : null
      }
    >
      <div className="an-multiselect-filter" role="group">
        <label className="an-multiselect-filter__option an-multiselect-filter__option--all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
          />
          <span>Select All</span>
        </label>
        <div
          className="an-multiselect-filter__list"
          role="listbox"
          aria-multiselectable
          aria-label={label}
        >
          {options.map((option) => {
            const checked = localSelected.includes(option);
            return (
              <label key={option} className="an-multiselect-filter__option">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(option)}
                />
                <span>{option}</span>
              </label>
            );
          })}
        </div>
      </div>
    </OutlinedSelect>
  );
}
