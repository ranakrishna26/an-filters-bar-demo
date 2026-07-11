export type NetworkMode = '4G' | '5G' | '5G SA' | '5G NSA';
export type Granularity = '1 hour' | '1 day' | '1 week' | '1 month' | 'Custom';
export type FilterKind = 'multi' | 'single' | 'kpi';
export type DateField = 'start' | 'end';

export interface FilterFieldDef {
  id: string;
  label: string;
  kind: FilterKind;
  options: readonly string[];
  selected: string[];
}

export interface KpiGroup {
  heading: string;
  items: readonly string[];
}

export interface AreaFilterDef {
  label: string;
  options: readonly string[];
  initialSelected?: readonly string[];
}

export interface FilterSnapshot {
  network: NetworkMode;
  fields: FilterFieldDef[];
  activeAreas: string[];
  areaSelections: Record<string, string[]>;
  granularity: Granularity;
  startDate: Date;
  endDate: Date;
  startHour: number;
}

export interface Favorite {
  id: string;
  name: string;
  snapshot: FilterSnapshot;
}

export interface FiltersState {
  network: NetworkMode;
  fields: readonly string[];
  granularity: Granularity;
  startDate: Date;
  endDate: Date;
  startHour: number;
}

export const NETWORK_MODES = ['4G', '5G', '5G SA', '5G NSA'] as const;

export const GRANULARITIES = [
  '1 hour',
  '1 day',
  '1 week',
  '1 month',
  'Custom',
] as const;

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, hour) => ({
  value: hour,
  label: `${String(hour).padStart(2, '0')}:00`,
}));

export const KPI_GROUPS: readonly KpiGroup[] = [
  {
    heading: 'Connectivity',
    items: ['Attach Success %', 'NR RRC Setup Success'],
  },
  {
    heading: 'Reliability',
    items: [
      'Radio Link Failure Count',
      'X2/Xn1 Setup Success %',
      '5G Handover Success %',
      'IRAT Handovers',
      'OTA Packet Delay',
      'OTA Packet Drop',
    ],
  },
  {
    heading: 'Signal',
    items: ['RSRP', 'RSRQ', 'diSNR', 'uiSNR', 'BLER', 'CQI'],
  },
  {
    heading: 'Throughput',
    items: ['DL Throughput', 'UL Throughput'],
  },
];

export const KPI_OPTIONS = KPI_GROUPS.flatMap((g) => g.items);

export const AREA_OF_INTEREST_OPTIONS = [
  'PLMN',
  'Region',
  'Cluster',
  'Postal code',
  'TAC',
  'Site',
  'gNodeB',
  'Sector',
  'Slice',
] as const;

function buildItems(count: number): string[] {
  return Array.from({ length: count }, (_, i) => `Item ${i + 1}`);
}

export const AREA_FILTERS: Record<string, AreaFilterDef> = {
  PLMN: { label: 'PLMN', options: buildItems(6) },
  Cluster: { label: 'Cluster', options: buildItems(7) },
  TAC: { label: 'TAC', options: buildItems(9) },
  Site: { label: 'Site', options: buildItems(8) },
  gNodeB: { label: 'gNodeB', options: buildItems(6) },
  Sector: { label: 'Sector', options: buildItems(9) },
  Slice: { label: 'Slice', options: buildItems(7) },
  Region: {
    label: 'Region',
    options: [
      'East of England',
      'East Midlands',
      'London',
      'North East',
      'North West',
      'South East',
      'South West',
      'West Midlands',
      'Yorkshire and Humber',
    ],
    initialSelected: ['London'],
  },
  'Postal code': {
    label: 'Postal code',
    options: [
      'E (Eastern London)',
      'EC (East Ctr London)',
      'N (Northern London)',
      'NW (North West Ldn)',
      'SE (South East Ldn)',
      'SW (South West Ldn)',
      'W (Western London)',
      'WC (West Ctr London)',
    ],
    initialSelected: ['EC (East Ctr London)', 'NW (North West Ldn)'],
  },
};

export const INITIAL_FIELDS: readonly FilterFieldDef[] = [
  {
    id: 'services',
    label: 'Services',
    kind: 'multi',
    options: ['Data', 'SMS', 'Streaming', 'Voice'],
    selected: ['Data', 'SMS', 'Streaming', 'Voice'],
  },
  {
    id: 'subscribers',
    label: 'Subscribers',
    kind: 'multi',
    options: ['Custom group', 'IMSI/MSISDN', 'IoT', 'Roamers', 'VIP', 'VIP+'],
    selected: ['Custom group', 'IMSI/MSISDN', 'IoT', 'Roamers', 'VIP', 'VIP+'],
  },
  {
    id: 'kpi',
    label: 'KPI',
    kind: 'kpi',
    options: KPI_OPTIONS,
    selected: ['RSRP'],
  },
];

export const DEFAULT_AREAS: readonly string[] = [];

export function buildAreaDefaults(): Record<string, string[]> {
  return Object.fromEntries(
    Object.entries(AREA_FILTERS).map(([key, def]) => [
      key,
      [...(def.initialSelected ?? [])],
    ]),
  );
}

export const DEFAULT_START_DATE = new Date(2026, 2, 10);
export const DEFAULT_END_DATE = new Date(2026, 2, 23);
export const DEFAULT_START_HOUR = 12;
export const DEFAULT_NETWORK: NetworkMode = '5G SA';
export const DEFAULT_GRANULARITY: Granularity = '1 day';

export function cloneFields(
  fields: readonly FilterFieldDef[],
): FilterFieldDef[] {
  return fields.map((field) => ({
    ...field,
    options: [...field.options],
    selected: [...field.selected],
  }));
}

export function snapshotSignature(snapshot: FilterSnapshot): string {
  const fields = [...snapshot.fields]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((f) => `${f.id}=${[...f.selected].sort().join('|')}`);
  const areas = [...snapshot.activeAreas]
    .sort()
    .map(
      (area) =>
        `${area}=${[...(snapshot.areaSelections[area] ?? [])].sort().join('|')}`,
    );
  return JSON.stringify({
    network: snapshot.network,
    fields,
    areas,
    start: snapshot.startDate.getTime(),
    end: snapshot.endDate.getTime(),
    hour: snapshot.startHour,
  });
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSingleDayGranularity(granularity: Granularity): boolean {
  return granularity === '1 hour' || granularity === '1 day';
}

export function isRangeGranularity(granularity: Granularity): boolean {
  return (
    granularity === '1 week' ||
    granularity === '1 month' ||
    granularity === 'Custom'
  );
}
