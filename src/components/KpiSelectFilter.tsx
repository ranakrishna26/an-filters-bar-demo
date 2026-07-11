import { KPI_GROUPS } from '../demoData';
import { Chip } from './Chip';
import { OutlinedSelect } from './OutlinedSelect';

interface KpiSelectFilterProps {
  selected: string | null;
  onChange: (kpi: string | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KpiSelectFilter({
  selected,
  onChange,
  open,
  onOpenChange,
}: KpiSelectFilterProps) {
  return (
    <OutlinedSelect
      label="KPI"
      open={open}
      onOpenChange={onOpenChange}
      width="wide"
      matchMenuWidth={false}
      chip={
        selected ? (
          <Chip onClear={() => onChange(null)} clearLabel="Clear KPI">
            {selected}
          </Chip>
        ) : null
      }
    >
      <div className="an-kpi-list" role="listbox" aria-label="KPI">
        {KPI_GROUPS.map((group, index) => (
          <div key={group.heading} className="an-kpi-list__group">
            {index > 0 && <div className="an-kpi-list__divider" />}
            <div className="an-kpi-list__heading">{group.heading}</div>
            {group.items.map((item) => {
              const isSelected = selected === item;
              return (
                <button
                  key={item}
                  type="button"
                  className="an-kpi-list__option"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(item);
                    onOpenChange(false);
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </OutlinedSelect>
  );
}
