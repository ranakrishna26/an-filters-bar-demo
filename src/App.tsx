import { useEffect, useMemo, useState } from 'react';
import { FilterStatePanel } from './FilterStatePanel';
import { FiltersBarDemo } from './FiltersBarDemo';
import type { FiltersState } from './demoData';
import './styles/tokens.css';
import './styles/filterBar.css';

type Theme = 'connect-light' | 'connect-dark';

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

export default function App() {
  const initial = useMemo(() => readQuery(), []);
  const [theme, setTheme] = useState<Theme>(initial.theme);
  const embed = initial.embed;
  const [filtersState, setFiltersState] = useState<FiltersState | null>(null);
  const [detail, setDetail] = useState<{
    services: string[];
    subscribers: string[];
    kpi: string | null;
    activeAreas: string[];
    areaSelections: Record<string, string[]>;
  } | null>(null);

  useEffect(() => {
    document.body.className = theme;
    document.documentElement.dataset.embed = embed ? 'true' : 'false';
  }, [theme, embed]);

  return (
    <div className={`app-shell${embed ? ' app-shell--embed' : ''}`}>
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
      <FiltersBarDemo
        onChange={setFiltersState}
        onViewState={setDetail}
      />
      {!embed && (
        <FilterStatePanel
          state={filtersState}
          extra={detail ?? undefined}
        />
      )}
    </div>
  );
}
