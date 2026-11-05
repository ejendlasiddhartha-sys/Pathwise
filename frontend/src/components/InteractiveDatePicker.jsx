import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Calculates accurate age from a birth date.
 * Returns { years, isFuture, isValid }
 */
export function calculateAge(dobString) {
  if (!dobString) return { years: null, isFuture: false, isValid: false };
  const birth = new Date(dobString);
  if (isNaN(birth.getTime())) return { years: null, isFuture: false, isValid: false };

  const today = new Date();
  if (birth > today) {
    return { years: 0, isFuture: true, isValid: false };
  }

  let years = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    years--;
  }

  return { years: Math.max(0, years), isFuture: false, isValid: true };
}

export default function InteractiveDatePicker({ value, onChange, error }) {
  // Parse existing date or default to 20 years ago
  const today = new Date();
  const parsedInitial = value ? new Date(value) : null;
  const initialYear = parsedInitial && !isNaN(parsedInitial.getTime())
    ? parsedInitial.getFullYear()
    : today.getFullYear() - 20;
  const initialMonth = parsedInitial && !isNaN(parsedInitial.getTime())
    ? parsedInitial.getMonth()
    : 0;

  const [displayYear, setDisplayYear] = useState(initialYear);
  const [displayMonth, setDisplayMonth] = useState(initialMonth);

  // Generate Year options from 1950 to current year
  const currentYear = today.getFullYear();
  const yearOptions = useMemo(() => {
    const list = [];
    for (let y = currentYear; y >= 1950; y--) {
      list.push(y);
    }
    return list;
  }, [currentYear]);

  // Compute calendar days for the current display month and year
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(displayYear, displayMonth, 1).getDay();
    const daysInCurrentMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: displayMonth - 1,
        year: displayYear,
        isCurrentMonth: false,
        isFuture: true, // we disable prev month days for simplicity
      });
    }

    // Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const dateObj = new Date(displayYear, displayMonth, d);
      // Strip time
      const dateMidnight = new Date(displayYear, displayMonth, d, 23, 59, 59);
      const isFuture = dateMidnight > today;

      days.push({
        day: d,
        month: displayMonth,
        year: displayYear,
        isCurrentMonth: true,
        isFuture,
        dateString: `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
      });
    }

    // Next month padding to fill a 6-row grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        month: displayMonth + 1,
        year: displayYear,
        isCurrentMonth: false,
        isFuture: true,
      });
    }

    return days;
  }, [displayYear, displayMonth]);

  const handlePrevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear((prev) => prev - 1);
    } else {
      setDisplayMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayYear === currentYear && displayMonth >= today.getMonth()) {
      return; // Prevent navigating to future month
    }
    if (displayMonth === 11) {
      if (displayYear + 1 <= currentYear) {
        setDisplayMonth(0);
        setDisplayYear((prev) => prev + 1);
      }
    } else {
      setDisplayMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (cell) => {
    if (!cell.isCurrentMonth || cell.isFuture) return;
    onChange(cell.dateString);
  };

  // Selected date object & age computation
  const ageData = useMemo(() => calculateAge(value), [value]);

  const formattedSelectedDate = useMemo(() => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [value]);

  const canGoNextMonth = !(
    displayYear >= currentYear && displayMonth >= today.getMonth()
  );

  return (
    <div className="w-full space-y-4">
      {/* Calendar Card Container */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-sky-300">
        {/* Header: Month & Year Selectors with Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-sky-50/50 p-4">
          <div className="flex items-center gap-2">
            {/* Month Dropdown */}
            <select
              value={displayMonth}
              onChange={(e) => setDisplayMonth(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              aria-label="Select birth month"
            >
              {MONTH_NAMES.map((name, idx) => (
                <option
                  key={name}
                  value={idx}
                  disabled={displayYear === currentYear && idx > today.getMonth()}
                >
                  {name}
                </option>
              ))}
            </select>

            {/* Year Dropdown */}
            <select
              value={displayYear}
              onChange={(e) => {
                const newY = Number(e.target.value);
                setDisplayYear(newY);
                if (newY === currentYear && displayMonth > today.getMonth()) {
                  setDisplayMonth(today.getMonth());
                }
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 shadow-xs focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              aria-label="Select birth year"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Prev / Next Month Chevrons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-white hover:text-sky-600 focus:outline-none"
              title="Previous month"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={handleNextMonth}
              disabled={!canGoNextMonth}
              className={`rounded-lg p-1.5 transition focus:outline-none ${
                canGoNextMonth
                  ? "text-slate-600 hover:bg-white hover:text-sky-600"
                  : "cursor-not-allowed text-slate-300"
              }`}
              title="Next month"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50 py-2 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          {DAYS_OF_WEEK.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 p-3">
          {calendarDays.map((cell, idx) => {
            const isSelected = value && cell.dateString === value;
            const isToday =
              cell.isCurrentMonth &&
              cell.day === today.getDate() &&
              cell.month === today.getMonth() &&
              cell.year === today.getFullYear();

            return (
              <button
                key={idx}
                type="button"
                disabled={!cell.isCurrentMonth || cell.isFuture}
                onClick={() => handleSelectDay(cell)}
                className={`relative flex h-10 w-full items-center justify-center rounded-xl text-sm transition font-medium focus:outline-none ${
                  !cell.isCurrentMonth
                    ? "cursor-default text-slate-200"
                    : cell.isFuture
                    ? "cursor-not-allowed text-slate-300 bg-slate-50/50 line-through"
                    : isSelected
                    ? "bg-sky-500 font-bold text-white shadow-md shadow-sky-500/30 ring-2 ring-sky-300 scale-105"
                    : "text-slate-700 hover:bg-sky-50 hover:text-sky-700 active:scale-95"
                }`}
              >
                {cell.day}
                {isToday && !isSelected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-sky-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Summary & Dynamic Age Calculation Card */}
      {value && ageData.isValid ? (
        <div className="animate-fade-in flex flex-col gap-3 rounded-2xl border border-sky-200/80 bg-gradient-to-r from-sky-50/70 via-white to-pink-50/60 p-4 sm:flex-row sm:items-center sm:justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-500 text-white shadow-sm">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-sky-700">
                Selected Date of Birth
              </p>
              <p className="text-base font-bold text-slate-900">
                {formattedSelectedDate}
              </p>
            </div>
          </div>

          {/* Dynamic Age Badge with subtle light pink accent */}
          <div className="flex items-center gap-2 rounded-xl border border-pink-200/60 bg-pink-50/80 px-4 py-2 text-pink-800 shadow-xs">
            <Sparkles className="h-4 w-4 text-pink-500" />
            <div>
              <span className="text-xs font-medium uppercase text-pink-600 block">
                Calculated Age
              </span>
              <span className="text-sm font-bold text-pink-900">
                {ageData.years} Years Old
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <Clock className="h-4 w-4 text-slate-400" />
          <span>Select your year, month, and day above to automatically compute your age. Future dates are disabled.</span>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-red-600 animate-fade-in">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
