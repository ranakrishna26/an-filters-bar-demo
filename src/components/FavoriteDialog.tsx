import { useEffect, useId, useRef, useState } from 'react';
import { CloseIcon } from './icons';

interface FavoriteDialogProps {
  mode: 'save' | 'update';
  initialName: string;
  onSave: (name: string) => void;
  onRemove?: () => void;
  onClose: () => void;
}

export function FavoriteDialog({
  mode,
  initialName,
  onSave,
  onRemove,
  onClose,
}: FavoriteDialogProps) {
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave(trimmed);
  };

  return (
    <div className="an-favorite-dialog-backdrop" onMouseDown={onClose}>
      <div
        className="an-favorite-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="an-favorite-dialog__header">
          <h2 id={titleId} className="an-favorite-dialog__title">
            {mode === 'save' ? 'Save as favorite' : 'Update favorite'}
          </h2>
          <button
            type="button"
            className="an-favorite-dialog__close"
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon size={18} />
          </button>
        </div>
        <label className="an-favorite-dialog__field">
          <span>Name this filter group</span>
          <input
            ref={inputRef}
            value={name}
            required
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submit();
              }
            }}
          />
        </label>
        <div className="an-favorite-dialog__actions">
          {mode === 'update' && onRemove && (
            <button
              type="button"
              className="an-favorite-dialog__remove"
              onClick={onRemove}
            >
              Remove
            </button>
          )}
          <button
            type="button"
            className="an-favorite-dialog__save"
            disabled={!name.trim()}
            onClick={submit}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
