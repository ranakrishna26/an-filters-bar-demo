import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react';
import { ChevronDownIcon } from './icons';

interface OutlinedSelectProps {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  width?: 'wide' | 'select' | 'narrow' | 'auto';
  chip?: ReactNode;
  matchMenuWidth?: boolean;
  children: ReactNode;
  className?: string;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

export function OutlinedSelect({
  label,
  open,
  onOpenChange,
  width = 'wide',
  chip,
  matchMenuWidth = true,
  children,
  className = '',
  triggerRef,
}: OutlinedSelectProps) {
  const localRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const buttonRef = triggerRef ?? localRef;

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

  return (
    <div
      className={`an-outlined-select an-outlined-select--${width}${
        open ? ' an-outlined-select--open' : ''
      } ${className}`.trim()}
      ref={rootRef}
    >
      <button
        ref={buttonRef}
        type="button"
        className="an-outlined-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => onOpenChange(!open)}
      >
        <span className="an-outlined-select__label">{label}</span>
        {chip}
        <ChevronDownIcon size={16} className="an-outlined-select__chevron" />
      </button>
      {open && (
        <div
          id={listId}
          className={`an-filter-bar-menu-surface${
            matchMenuWidth ? ' an-filter-bar-menu-surface--match' : ''
          }`}
          role="listbox"
        >
          {children}
        </div>
      )}
    </div>
  );
}
