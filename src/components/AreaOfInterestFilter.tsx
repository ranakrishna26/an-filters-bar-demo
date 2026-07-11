import { useEffect, useId, useRef } from 'react';
import { AREA_OF_INTEREST_OPTIONS } from '../demoData';
import { IconButton } from './IconButton';
import { PlusFilterIcon } from './icons';

interface AreaOfInterestFilterProps {
  activeAreas: string[];
  onChange: (areas: string[]) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AreaOfInterestFilter({
  activeAreas,
  onChange,
  open,
  onOpenChange,
}: AreaOfInterestFilterProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange]);

  const toggle = (area: string) => {
    if (activeAreas.includes(area)) {
      onChange(activeAreas.filter((item) => item !== area));
    } else {
      onChange([...activeAreas, area]);
    }
  };

  return (
    <div className="an-aoi" ref={rootRef}>
      <IconButton
        label="Add filter"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        active={open}
        onClick={() => onOpenChange(!open)}
      >
        <PlusFilterIcon size={18} />
      </IconButton>
      {open && (
        <div
          id={menuId}
          className="an-filter-bar-menu-surface an-aoi-menu"
          role="menu"
        >
          <div className="an-aoi-heading">Area of interest</div>
          <div className="an-aoi-list">
            {AREA_OF_INTEREST_OPTIONS.map((area) => {
              const checked = activeAreas.includes(area);
              return (
                <label key={area} className="an-aoi-option">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(area)}
                  />
                  <span>{area}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
