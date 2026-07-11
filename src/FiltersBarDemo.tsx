import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AreaOfInterestFilter } from './components/AreaOfInterestFilter';
import { CalendarPopup } from './components/CalendarPopup';
import { FavoriteDialog } from './components/FavoriteDialog';
import { IconButton } from './components/IconButton';
import { KpiSelectFilter } from './components/KpiSelectFilter';
import { MoreMenu } from './components/MoreMenu';
import { MultiSelectFilter } from './components/MultiSelectFilter';
import { OutlinedSelect } from './components/OutlinedSelect';
import { SegmentedControl } from './components/SegmentedControl';
import {
  AREA_FILTERS,
  DEFAULT_END_DATE,
  DEFAULT_GRANULARITY,
  DEFAULT_NETWORK,
  DEFAULT_START_DATE,
  DEFAULT_START_HOUR,
  GRANULARITIES,
  HOUR_OPTIONS,
  INITIAL_FIELDS,
  NETWORK_MODES,
  buildAreaDefaults,
  cloneFields,
  formatDate,
  isRangeGranularity,
  isSingleDayGranularity,
  snapshotSignature,
  type Favorite,
  type FilterFieldDef,
  type FilterSnapshot,
  type FiltersState,
  type Granularity,
  type NetworkMode,
} from './demoData';
import {
  CalendarIcon,
  StarIcon,
  TrashIcon,
} from './components/icons';

interface FiltersBarDemoProps {
  onChange?: (state: FiltersState) => void;
  onViewState?: (state: {
    services: string[];
    subscribers: string[];
    kpi: string | null;
    activeAreas: string[];
    areaSelections: Record<string, string[]>;
  }) => void;
}

type OpenId =
  | 'services'
  | 'subscribers'
  | 'kpi'
  | 'aoi'
  | 'granularity'
  | 'hour'
  | 'favorites'
  | 'more'
  | `area:${string}`
  | null;

function nextFilterGroupName(favorites: Favorite[]): string {
  let max = 0;
  for (const favorite of favorites) {
    const match = /^Filter group (\d+)$/i.exec(favorite.name.trim());
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `Filter group ${max + 1}`;
}

export function FiltersBarDemo({ onChange, onViewState }: FiltersBarDemoProps) {
  const [network, setNetwork] = useState<NetworkMode>(DEFAULT_NETWORK);
  const [fields, setFields] = useState<FilterFieldDef[]>(() =>
    cloneFields(INITIAL_FIELDS),
  );
  const [activeAreas, setActiveAreas] = useState<string[]>([]);
  const [areaSelections, setAreaSelections] = useState<Record<string, string[]>>(
    () => buildAreaDefaults(),
  );
  const [granularity, setGranularity] =
    useState<Granularity>(DEFAULT_GRANULARITY);
  const [startDate, setStartDate] = useState(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState(DEFAULT_END_DATE);
  const [startHour, setStartHour] = useState(DEFAULT_START_HOUR);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [openId, setOpenId] = useState<OpenId>(null);
  const [clearNonce, setClearNonce] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [favoriteDialog, setFavoriteDialog] = useState<
    null | { mode: 'save' | 'update'; favoriteId?: string }
  >(null);
  const [actionsSecondary, setActionsSecondary] = useState(false);
  const [primaryCount, setPrimaryCount] = useState(4);

  const rootRef = useRef<HTMLElement>(null);
  const mandatoryRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const currentSnapshot = useMemo<FilterSnapshot>(
    () => ({
      network,
      fields: cloneFields(fields),
      activeAreas: [...activeAreas],
      areaSelections: Object.fromEntries(
        Object.entries(areaSelections).map(([key, value]) => [key, [...value]]),
      ),
      granularity,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      startHour,
    }),
    [
      network,
      fields,
      activeAreas,
      areaSelections,
      granularity,
      startDate,
      endDate,
      startHour,
    ],
  );

  const matchedFavorite = useMemo(() => {
    const signature = snapshotSignature(currentSnapshot);
    return favorites.find(
      (favorite) => snapshotSignature(favorite.snapshot) === signature,
    );
  }, [favorites, currentSnapshot]);

  const emitChange = useCallback(() => {
    onChange?.({
      network,
      fields: fields.map(
        (field) => `${field.label}: ${field.selected.join(', ') || '—'}`,
      ),
      granularity,
      startDate,
      endDate,
      startHour,
    });
    onViewState?.({
      services: fields.find((f) => f.id === 'services')?.selected ?? [],
      subscribers: fields.find((f) => f.id === 'subscribers')?.selected ?? [],
      kpi: fields.find((f) => f.id === 'kpi')?.selected[0] ?? null,
      activeAreas: [...activeAreas],
      areaSelections: Object.fromEntries(
        Object.entries(areaSelections).map(([key, value]) => [key, [...value]]),
      ),
    });
  }, [
    onChange,
    onViewState,
    network,
    fields,
    granularity,
    startDate,
    endDate,
    startHour,
    activeAreas,
    areaSelections,
  ]);

  useEffect(() => {
    emitChange();
  }, [emitChange]);

  const setOnlyOpen = (id: OpenId) => {
    setCalendarOpen(false);
    setOpenId(id);
  };

  const updateFieldSelected = (id: string, selected: string[]) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, selected } : field)),
    );
  };

  const clearFilters = () => {
    setFields((prev) =>
      prev.map((field) => ({ ...field, selected: [] })),
    );
    setAreaSelections(
      Object.fromEntries(Object.keys(AREA_FILTERS).map((key) => [key, []])),
    );
    setClearNonce((n) => n + 1);
    setOpenId(null);
  };

  const restoreDefaults = () => {
    setNetwork(DEFAULT_NETWORK);
    setFields(cloneFields(INITIAL_FIELDS));
    setActiveAreas([]);
    setAreaSelections(buildAreaDefaults());
    setGranularity(DEFAULT_GRANULARITY);
    setStartDate(DEFAULT_START_DATE);
    setEndDate(DEFAULT_END_DATE);
    setStartHour(DEFAULT_START_HOUR);
    setClearNonce((n) => n + 1);
    setOpenId(null);
    setCalendarOpen(false);
  };

  const applySnapshot = (snapshot: FilterSnapshot) => {
    setNetwork(snapshot.network);
    setFields(cloneFields(snapshot.fields));
    setActiveAreas([...snapshot.activeAreas]);
    setAreaSelections(
      Object.fromEntries(
        Object.entries(snapshot.areaSelections).map(([key, value]) => [
          key,
          [...value],
        ]),
      ),
    );
    setGranularity(snapshot.granularity);
    setStartDate(new Date(snapshot.startDate));
    setEndDate(new Date(snapshot.endDate));
    setStartHour(snapshot.startHour);
    setClearNonce((n) => n + 1);
    setOpenId(null);
  };

  const onGranularityChange = (next: Granularity) => {
    setGranularity(next);
    if (isSingleDayGranularity(next)) {
      setEndDate(startDate);
    }
    setOpenId(null);
  };

  const saveFavorite = (name: string) => {
    if (favoriteDialog?.mode === 'update' && favoriteDialog.favoriteId) {
      setFavorites((prev) =>
        prev.map((favorite) =>
          favorite.id === favoriteDialog.favoriteId
            ? { ...favorite, name, snapshot: currentSnapshot }
            : favorite,
        ),
      );
    } else {
      setFavorites((prev) => [
        ...prev,
        {
          id: `fav-${Date.now()}`,
          name,
          snapshot: currentSnapshot,
        },
      ]);
    }
    setFavoriteDialog(null);
  };

  const removeFavorite = () => {
    if (!favoriteDialog?.favoriteId) return;
    setFavorites((prev) =>
      prev.filter((favorite) => favorite.id !== favoriteDialog.favoriteId),
    );
    setFavoriteDialog(null);
  };

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rootWidth = root.clientWidth;
        const actionsWidth = actionsRef.current?.scrollWidth ?? 0;
        const dateWidth = dateRef.current?.scrollWidth ?? 0;
        const available = rootWidth - actionsWidth - dateWidth - 48;

        const items = Array.from(
          mandatoryRef.current?.querySelectorAll<HTMLElement>(
            '.an-filters-bar__mandatory-item',
          ) ?? [],
        );
        let used = 0;
        let fit = 0;
        for (const item of items) {
          const next = used + item.offsetWidth + 12;
          if (next > available && fit > 0) break;
          used = next;
          fit += 1;
        }

        const overflow =
          (mandatoryRef.current?.scrollWidth ?? 0) +
            actionsWidth +
            dateWidth +
            36 >
          rootWidth;

        setActionsSecondary(overflow || fit < items.length);
        setPrimaryCount(Math.max(1, fit || items.length));
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [activeAreas, fields, granularity]);

  const services = fields.find((field) => field.id === 'services')!;
  const subscribers = fields.find((field) => field.id === 'subscribers')!;
  const kpi = fields.find((field) => field.id === 'kpi')!;

  const mandatoryItems = [
    {
      key: 'network',
      node: (
        <SegmentedControl
          value={network}
          options={NETWORK_MODES}
          onChange={setNetwork}
          ariaLabel="Network mode"
        />
      ),
    },
    {
      key: 'services',
      node: (
        <MultiSelectFilter
          id="services"
          label="Services"
          options={services.options}
          selected={services.selected}
          onChange={(selected) => updateFieldSelected('services', selected)}
          open={openId === 'services'}
          onOpenChange={(open) => setOnlyOpen(open ? 'services' : null)}
          resetSignal={clearNonce}
        />
      ),
    },
    {
      key: 'subscribers',
      node: (
        <MultiSelectFilter
          id="subscribers"
          label="Subscribers"
          options={subscribers.options}
          selected={subscribers.selected}
          onChange={(selected) => updateFieldSelected('subscribers', selected)}
          open={openId === 'subscribers'}
          onOpenChange={(open) => setOnlyOpen(open ? 'subscribers' : null)}
          resetSignal={clearNonce}
        />
      ),
    },
    {
      key: 'kpi',
      node: (
        <KpiSelectFilter
          selected={kpi.selected[0] ?? null}
          onChange={(value) =>
            updateFieldSelected('kpi', value ? [value] : [])
          }
          open={openId === 'kpi'}
          onOpenChange={(open) => setOnlyOpen(open ? 'kpi' : null)}
        />
      ),
    },
  ];

  const primaryItems = actionsSecondary
    ? mandatoryItems.slice(0, primaryCount)
    : mandatoryItems;
  const overflowItems = actionsSecondary
    ? mandatoryItems.slice(primaryCount)
    : [];

  const showHour = granularity === '1 hour';
  const showEnd = isRangeGranularity(granularity);

  const actions = (
    <div className="an-filters-bar__actions-cluster" ref={actionsRef}>
      <AreaOfInterestFilter
        activeAreas={activeAreas}
        onChange={setActiveAreas}
        open={openId === 'aoi'}
        onOpenChange={(open) => setOnlyOpen(open ? 'aoi' : null)}
      />
      <IconButton label="Clear filters" onClick={clearFilters}>
        <TrashIcon size={18} />
      </IconButton>
      <span className="an-filters-bar__divider" aria-hidden />
      <div className="an-favorites">
        <IconButton
          label={matchedFavorite ? 'Update this favorite' : 'Save as favorite'}
          active={openId === 'favorites'}
          onClick={() => setOnlyOpen(openId === 'favorites' ? null : 'favorites')}
        >
          <StarIcon
            size={18}
            filled={Boolean(matchedFavorite)}
            className={
              matchedFavorite ? 'an-star an-star--filled' : 'an-star'
            }
          />
        </IconButton>
        {openId === 'favorites' && (
          <div className="an-filter-bar-menu-surface an-favorites-menu" role="menu">
            <button
              type="button"
              className="an-more-list__item"
              role="menuitem"
              onClick={() => {
                setOpenId(null);
                setFavoriteDialog(
                  matchedFavorite
                    ? { mode: 'update', favoriteId: matchedFavorite.id }
                    : { mode: 'save' },
                );
              }}
            >
              {matchedFavorite ? 'Update this favorite' : 'Save as favorite'}
            </button>
          </div>
        )}
      </div>
      <MoreMenu
        favorites={favorites}
        open={openId === 'more'}
        onOpenChange={(open) => setOnlyOpen(open ? 'more' : null)}
        onApplyFavorite={(favorite) => applySnapshot(favorite.snapshot)}
        onRestoreDefaults={restoreDefaults}
      />
    </div>
  );

  const dateCluster = (
    <div className="an-filters-bar__date-range" ref={dateRef}>
      <div className="an-filters-bar__date-pickers">
        <button
          type="button"
          className="an-date-field"
          onClick={() => {
            setOpenId(null);
            setCalendarOpen(true);
          }}
        >
          {formatDate(startDate)}
        </button>
        {showEnd && (
          <button
            type="button"
            className="an-date-field"
            onClick={() => {
              setOpenId(null);
              setCalendarOpen(true);
            }}
          >
            {formatDate(endDate)}
          </button>
        )}
        {showHour && (
          <OutlinedSelect
            label={HOUR_OPTIONS[startHour]?.label ?? '12:00'}
            open={openId === 'hour'}
            onOpenChange={(open) => setOnlyOpen(open ? 'hour' : null)}
            width="narrow"
          >
            <div className="an-simple-list" role="listbox" aria-label="Hour">
              {HOUR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="an-simple-list__item"
                  role="option"
                  aria-selected={startHour === option.value}
                  onClick={() => {
                    setStartHour(option.value);
                    setOpenId(null);
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </OutlinedSelect>
        )}
      </div>
      <div className="an-filters-bar__calendar-wrap">
        <IconButton
          label="Open calendar"
          active={calendarOpen}
          onClick={() => {
            setOpenId(null);
            setCalendarOpen((open) => !open);
          }}
        >
          <CalendarIcon size={18} />
        </IconButton>
        {calendarOpen && (
          <CalendarPopup
            startDate={startDate}
            endDate={endDate}
            granularity={granularity}
            onChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            onClose={() => setCalendarOpen(false)}
          />
        )}
      </div>
      <OutlinedSelect
        label={granularity}
        open={openId === 'granularity'}
        onOpenChange={(open) => setOnlyOpen(open ? 'granularity' : null)}
        width="narrow"
      >
        <div className="an-simple-list" role="listbox" aria-label="Granularity">
          {GRANULARITIES.map((option) => (
            <button
              key={option}
              type="button"
              className="an-simple-list__item"
              role="option"
              aria-selected={granularity === option}
              onClick={() => onGranularityChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </OutlinedSelect>
    </div>
  );

  const exposed = (
    <div className="an-filters-bar__exposed-list">
      {activeAreas.map((area) => {
        const def = AREA_FILTERS[area];
        if (!def) return null;
        return (
          <div key={area} className="an-filters-bar__exposed-item">
            <MultiSelectFilter
              id={`area-${area}`}
              label={def.label}
              options={def.options}
              selected={areaSelections[area] ?? []}
              onChange={(selected) =>
                setAreaSelections((prev) => ({ ...prev, [area]: selected }))
              }
              open={openId === `area:${area}`}
              onOpenChange={(open) =>
                setOnlyOpen(open ? (`area:${area}` as OpenId) : null)
              }
              resetSignal={clearNonce}
              matchTriggerListWidth={false}
            />
          </div>
        );
      })}
    </div>
  );

  const className = [
    'an-filters-bar',
    activeAreas.length > 0 ? 'an-filters-bar--has-exposed' : '',
    actionsSecondary ? 'an-filters-bar--actions-secondary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <header
        ref={rootRef}
        className={className}
        aria-label="Global filters"
      >
        <div className="an-filters-bar__mandatory" ref={mandatoryRef}>
          {primaryItems.map((item) => (
            <div key={item.key} className="an-filters-bar__mandatory-item">
              {item.node}
            </div>
          ))}
        </div>

        {!actionsSecondary && (
          <div className="an-filters-bar__actions">{actions}</div>
        )}

        <div className="an-filters-bar__date">{dateCluster}</div>

        {actionsSecondary && (
          <div className="an-filters-bar__secondary">
            {actions}
            {overflowItems.map((item) => (
              <div key={item.key} className="an-filters-bar__mandatory-item">
                {item.node}
              </div>
            ))}
            {activeAreas.length > 0 && exposed}
          </div>
        )}

        {!actionsSecondary && activeAreas.length > 0 && (
          <div className="an-filters-bar__exposed">{exposed}</div>
        )}
      </header>

      {favoriteDialog && (
        <FavoriteDialog
          mode={favoriteDialog.mode}
          initialName={
            favoriteDialog.mode === 'update' && matchedFavorite
              ? matchedFavorite.name
              : nextFilterGroupName(favorites)
          }
          onSave={saveFavorite}
          onRemove={
            favoriteDialog.mode === 'update' ? removeFavorite : undefined
          }
          onClose={() => setFavoriteDialog(null)}
        />
      )}
    </>
  );
}

export type { FiltersState };
