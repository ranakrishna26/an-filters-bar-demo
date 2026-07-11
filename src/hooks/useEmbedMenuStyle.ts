import {
  useLayoutEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from 'react';

function isEmbed() {
  return document.documentElement.dataset.embed === 'true';
}

/** In Framer iframes, anchor menus with position:fixed to the trigger so they aren't clipped. */
export function useEmbedMenuStyle(
  open: boolean,
  anchorRef: RefObject<HTMLElement | null>,
  opts?: { minHeight?: number; matchWidth?: boolean },
): CSSProperties | undefined {
  const [style, setStyle] = useState<CSSProperties | undefined>();
  const minHeight = opts?.minHeight ?? 240;
  const matchWidth = opts?.matchWidth ?? true;

  useLayoutEffect(() => {
    if (!open || !isEmbed()) {
      setStyle(undefined);
      return;
    }

    const update = () => {
      const el = anchorRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < minHeight && rect.top > spaceBelow;
      const next: CSSProperties = {
        position: 'fixed',
        left: Math.max(8, Math.min(rect.left, window.innerWidth - 200)),
        zIndex: 1000,
        maxHeight: Math.max(160, openUp ? rect.top - 12 : spaceBelow - 12),
      };
      if (matchWidth) next.minWidth = rect.width;
      if (openUp) {
        next.bottom = window.innerHeight - rect.top + 4;
        next.top = 'auto';
      } else {
        next.top = rect.bottom + 4;
        next.bottom = 'auto';
      }
      setStyle(next);
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef, minHeight, matchWidth]);

  return style;
}
