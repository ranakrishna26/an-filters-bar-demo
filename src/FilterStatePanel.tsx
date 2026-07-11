import type { FiltersState } from './demoData';
import { formatDate } from './demoData';

interface FilterStatePanelProps {
  state: FiltersState | null;
  extra?: {
    activeAreas: string[];
    areaSelections: Record<string, string[]>;
    kpi: string | null;
    services: string[];
    subscribers: string[];
  };
}

export function FilterStatePanel({ state, extra }: FilterStatePanelProps) {
  if (!state) {
    return (
      <section className="an-filter-state-panel" aria-label="Filter state">
        <h2>Filter state</h2>
        <p className="an-filter-state-panel__empty">No state yet</p>
      </section>
    );
  }

  return (
    <section className="an-filter-state-panel" aria-label="Filter state">
      <h2>Filter state</h2>
      <div className="an-filter-state-panel__grid">
        <div>
          <span className="an-filter-state-panel__label">Network</span>
          <span className="an-chip an-chip--soft-grey">{state.network}</span>
        </div>
        {extra && (
          <>
            <div>
              <span className="an-filter-state-panel__label">Services</span>
              <div className="an-filter-state-panel__chips">
                {extra.services.length === 0 ? (
                  <span className="an-filter-state-panel__muted">None</span>
                ) : (
                  extra.services.map((item) => (
                    <span key={item} className="an-chip an-chip--soft-grey">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="an-filter-state-panel__label">Subscribers</span>
              <div className="an-filter-state-panel__chips">
                {extra.subscribers.length === 0 ? (
                  <span className="an-filter-state-panel__muted">None</span>
                ) : (
                  extra.subscribers.map((item) => (
                    <span key={item} className="an-chip an-chip--soft-grey">
                      {item}
                    </span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="an-filter-state-panel__label">KPI</span>
              {extra.kpi ? (
                <span className="an-chip an-chip--soft-grey">{extra.kpi}</span>
              ) : (
                <span className="an-filter-state-panel__muted">None</span>
              )}
            </div>
            <div>
              <span className="an-filter-state-panel__label">Area filters</span>
              {extra.activeAreas.length === 0 ? (
                <span className="an-filter-state-panel__muted">None</span>
              ) : (
                <div className="an-filter-state-panel__areas">
                  {extra.activeAreas.map((area) => (
                    <div key={area}>
                      <strong>{area}:</strong>{' '}
                      {(extra.areaSelections[area] ?? []).join(', ') || '—'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
        <div>
          <span className="an-filter-state-panel__label">Date range</span>
          <span>
            {formatDate(state.startDate)}
            {state.endDate.getTime() !== state.startDate.getTime()
              ? ` → ${formatDate(state.endDate)}`
              : ''}
            {` · ${String(state.startHour).padStart(2, '0')}:00 · ${state.granularity}`}
          </span>
        </div>
      </div>
      <details className="an-filter-state-panel__json">
        <summary>Raw onChange payload</summary>
        <pre>{JSON.stringify(
          {
            network: state.network,
            fields: state.fields,
            granularity: state.granularity,
            startDate: formatDate(state.startDate),
            endDate: formatDate(state.endDate),
            startHour: state.startHour,
          },
          null,
          2,
        )}</pre>
      </details>
    </section>
  );
}
