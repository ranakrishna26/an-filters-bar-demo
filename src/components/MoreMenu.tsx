import { useEffect, useId, useRef } from 'react';
import type { Favorite } from '../demoData';
import { useEmbedMenuStyle } from '../hooks/useEmbedMenuStyle';
import { IconButton } from './IconButton';
import { MoreIcon } from './icons';

interface MoreMenuProps {
  favorites: Favorite[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFavorite: (favorite: Favorite) => void;
  onRestoreDefaults: () => void;
}

export function MoreMenu({
  favorites,
  open,
  onOpenChange,
  onApplyFavorite,
  onRestoreDefaults,
}: MoreMenuProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  const menuStyle = useEmbedMenuStyle(open, triggerRef, {
    matchWidth: false,
    minHeight: 160,
  });

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
    <div className="an-more" ref={rootRef}>
      <IconButton
        ref={triggerRef}
        label="More"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        active={open}
        onClick={() => onOpenChange(!open)}
      >
        <MoreIcon size={18} />
      </IconButton>
      {open && (
        <div
          id={menuId}
          className={`an-filter-bar-menu-surface an-more-list${
            menuStyle ? ' an-filter-bar-menu-surface--anchored' : ''
          }`}
          role="menu"
          style={menuStyle}
        >
          {favorites.length > 0 && (
            <>
              <div className="an-more-list__header">Favorites</div>
              {favorites.map((favorite) => (
                <button
                  key={favorite.id}
                  type="button"
                  className="an-more-list__item"
                  role="menuitem"
                  onClick={() => {
                    onApplyFavorite(favorite);
                    onOpenChange(false);
                  }}
                >
                  {favorite.name}
                </button>
              ))}
              <div className="an-more-list__divider" />
            </>
          )}
          <button
            type="button"
            className="an-more-list__item"
            role="menuitem"
            onClick={() => {
              onRestoreDefaults();
              onOpenChange(false);
            }}
          >
            Restore defaults
          </button>
        </div>
      )}
    </div>
  );
}
