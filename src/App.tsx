import { useEffect, useMemo, useRef, useState } from 'react';
import { FiltersBarDemo } from './FiltersBarDemo';
import './styles/tokens.css';
import './styles/filterBar.css';

type Theme = 'connect-light' | 'connect-dark';

/** Framer embed design frame. */
export const FRAME_WIDTH = 1106;
export const FRAME_HEIGHT = 718.5;

/** Design width of the bar; scaled uniformly to fill the frame. */
const BAR_WIDTH = 760;
const FRAME_PAD = 56;

function readQuery() {
  const params = new URLSearchParams(window.location.search);
  const themeParam = params.get('theme');
  const theme: Theme =
    themeParam === 'dark' ? 'connect-dark' : 'connect-light';
  const embed =
    params.get('embed') === '1' ||
    params.get('embed') === 'true' ||
    window.self !== window.top;
  return { theme, embed };
}

function useContainScale(
  enabled: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
  designW: number,
  designH: number,
) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      if (width < 1 || height < 1) return;
      const next = Math.min(width / designW, height / designH);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [enabled, containerRef, designW, designH]);

  return scale;
}

/** Uniform scale — fill frame width, allow scale > 1. */
const barScale = (FRAME_WIDTH - FRAME_PAD * 2) / BAR_WIDTH;

export default function App() {
  const initial = useMemo(() => readQuery(), []);
  const [theme, setTheme] = useState<Theme>(initial.theme);
  const embed = initial.embed;
  const shellRef = useRef<HTMLDivElement>(null);
  const frameScale = useContainScale(
    embed,
    shellRef,
    FRAME_WIDTH,
    FRAME_HEIGHT,
  );

  useEffect(() => {
    document.body.className = theme;
    document.documentElement.dataset.embed = embed ? 'true' : 'false';
  }, [theme, embed]);

  return (
    <div
      ref={shellRef}
      className={`app-shell${embed ? ' app-shell--embed' : ''}`}
    >
      {!embed && (
        <button
          type="button"
          className="app-shell__theme-toggle"
          onClick={() =>
            setTheme((current) =>
              current === 'connect-light' ? 'connect-dark' : 'connect-light',
            )
          }
        >
          {theme === 'connect-light' ? 'Dark theme' : 'Light theme'}
        </button>
      )}

      {embed ? (
        <div
          className="embed-frame"
          style={{
            width: FRAME_WIDTH * frameScale,
            height: FRAME_HEIGHT * frameScale,
          }}
        >
          <div
            className="embed-frame__canvas"
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              transform: `scale(${frameScale})`,
            }}
          >
            <div className="embed-frame__center">
              <div
                className="embed-bar"
                style={{ transform: `scale(${barScale})` }}
              >
                <FiltersBarDemo />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <FiltersBarDemo />
      )}
    </div>
  );
}
