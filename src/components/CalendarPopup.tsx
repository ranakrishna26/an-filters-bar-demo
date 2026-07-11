import { useMemo, useState } from 'react';
import {
  isRangeGranularity,
  isSameDay,
  startOfDay,
  type Granularity,
} from '../demoData';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';
import { IconButton } from './IconButton';

interface CalendarPopupProps {
  startDate: Date;
  endDate: Date;
  granularity: Granularity;
  onChange: (start: Date, end: Date) => void;
  onClose: () => void;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function CalendarPopup({
  startDate,
  endDate,
  granularity,
  onChange,
  onClose,
}: CalendarPopupProps) {
  const [view, setView] = useState(
    () => new Date(startDate.getFullYear(), startDate.getMonth(), 1),
  );
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const rangeMode = isRangeGranularity(granularity);

  const cells = useMemo(() => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const total = daysInMonth(year, month);
    const blanks = Array.from({ length: firstDow }, () => null);
    const days = Array.from({ length: total }, (_, i) => new Date(year, month, i + 1));
    return [...blanks, ...days];
  }, [view]);

  const rangeStart = pendingStart ?? startDate;
  const rangeEnd = pendingStart ? pendingStart : endDate;

  const setDayProps = (day: Date) => {
    const start = startOfDay(rangeStart);
    const end = startOfDay(rangeEnd);
    const low = start.getTime() <= end.getTime() ? start : end;
    const high = start.getTime() <= end.getTime() ? end : start;
    const t = startOfDay(day).getTime();
    const inRange = t >= low.getTime() && t <= high.getTime();
    const firstInRange = isSameDay(day, low);
    const lastInRange = isSameDay(day, high);
    return { inRange, firstInRange, lastInRange };
  };

  const onDayClick = (day: Date) => {
    const picked = startOfDay(day);
    if (!rangeMode) {
      onChange(picked, picked);
      onClose();
      return;
    }

    if (!pendingStart) {
      setPendingStart(picked);
      return;
    }

    let start = pendingStart;
    let end = picked;
    if (end.getTime() < start.getTime()) {
      [start, end] = [end, start];
    }
    setPendingStart(null);
    onChange(start, end);
    onClose();
  };

  const monthLabel = view.toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="an-filters-bar-calendar-popup" role="dialog" aria-label="Calendar">
      <div className="an-calendar__header">
        <IconButton
          label="Previous month"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
          }
        >
          <ChevronLeftIcon size={18} />
        </IconButton>
        <div className="an-calendar__title">{monthLabel}</div>
        <IconButton
          label="Next month"
          onClick={() =>
            setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))
          }
        >
          <ChevronRightIcon size={18} />
        </IconButton>
      </div>
      <div className="an-calendar__weekdays" aria-hidden>
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="an-calendar__grid" role="grid" aria-label={monthLabel}>
        {cells.map((day, index) => {
          if (!day) {
            return <span key={`blank-${index}`} className="an-calendar__empty" />;
          }
          const { inRange, firstInRange, lastInRange } = setDayProps(day);
          const selected =
            isSameDay(day, startDate) || isSameDay(day, endDate) || firstInRange || lastInRange;
          return (
            <button
              key={day.toISOString()}
              type="button"
              className={[
                'an-calendar__day',
                inRange ? 'in-range' : '',
                firstInRange ? 'first-in-range' : '',
                lastInRange ? 'last-in-range' : '',
                selected ? 'is-selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onDayClick(day)}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
