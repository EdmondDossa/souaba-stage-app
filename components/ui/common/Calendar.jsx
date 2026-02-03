import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

const parseDateValue = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value !== "string") return null;

  const slashParts = value.split("/");
  if (slashParts.length === 3) {
    const [day, month, year] = slashParts.map((part) => Number.parseInt(part, 10));
    if ([day, month, year].every((part) => Number.isFinite(part))) {
      return new Date(year, month - 1, day);
    }
  }

  const dashParts = value.split("-");
  if (dashParts.length === 3) {
    const [year, month, day] = dashParts.map((part) => Number.parseInt(part, 10));
    if ([day, month, year].every((part) => Number.isFinite(part))) {
      return new Date(year, month - 1, day);
    }
  }

  return null;
};

const startOfDay = (value) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const getDayTimestamp = (value) => {
  if (!value) return null;
  return startOfDay(value).getTime();
};

// Composant Calendrier
const Calendar = ({
  selectedDate,
  onDateSelect,
  minDate,
  allowPastDates = false,
  rangeStart,
  rangeEnd,
  previewRangeEnd,
  onDateHover,
  onDateHoverLeave,
}) => {
  const today = useMemo(() => startOfDay(new Date()), []);
  const selected = parseDateValue(selectedDate);
  const rangeStartDate = parseDateValue(rangeStart);
  const rangeEndDate = parseDateValue(rangeEnd);
  const rangeStartTimestamp = getDayTimestamp(rangeStartDate);
  const rangeEndTimestamp = getDayTimestamp(rangeEndDate);
  const previewRangeEndDate = parseDateValue(previewRangeEnd);
  const previewRangeTimestamp = getDayTimestamp(previewRangeEndDate);

  const normalizedMinDate = allowPastDates
    ? null
    : startOfDay(parseDateValue(minDate) || today);
  const initialDisplayDate = selected || normalizedMinDate || today;

  const [dateOnDisplay, setDateOnDisplay] = useState(initialDisplayDate);
  const selectedTimestamp = selected ? startOfDay(selected).getTime() : null;
  const minTimestamp = normalizedMinDate ? normalizedMinDate.getTime() : null;
  const highlightEndTimestamp =
    rangeEndTimestamp !== null
      ? rangeEndTimestamp
      : previewRangeTimestamp;
  const hasHighlightRange =
    rangeStartTimestamp !== null && highlightEndTimestamp !== null;
  const highlightMin =
    hasHighlightRange && highlightEndTimestamp !== null
      ? Math.min(rangeStartTimestamp, highlightEndTimestamp)
      : null;
  const highlightMax =
    hasHighlightRange && highlightEndTimestamp !== null
      ? Math.max(rangeStartTimestamp, highlightEndTimestamp)
      : null;
  const isPreviewRange =
    rangeEndTimestamp === null && previewRangeTimestamp !== null;

  useEffect(() => {
    const targetDate = selected || normalizedMinDate || today;
    if (!targetDate) return;
    setDateOnDisplay((current) => {
      if (
        current.getFullYear() === targetDate.getFullYear() &&
        current.getMonth() === targetDate.getMonth()
      ) {
        return current;
      }
      return targetDate;
    });
  }, [selectedTimestamp, minTimestamp, today]);

  const canGoPrev = normalizedMinDate
    ? dateOnDisplay.getFullYear() > normalizedMinDate.getFullYear() ||
      (dateOnDisplay.getFullYear() === normalizedMinDate.getFullYear() &&
        dateOnDisplay.getMonth() > normalizedMinDate.getMonth())
    : true;

  function onMonthChange(direction) {
    if (direction === "prev" && !canGoPrev) return;

    const nextMonth =
      direction === "next"
        ? dateOnDisplay.getMonth() + 1
        : dateOnDisplay.getMonth() - 1;
    const nextDate = new Date(dateOnDisplay.getFullYear(), nextMonth, 1);

    if (normalizedMinDate) {
      const minMonthAnchor = new Date(
        normalizedMinDate.getFullYear(),
        normalizedMinDate.getMonth(),
        1
      );
      if (nextDate < minMonthAnchor) {
        setDateOnDisplay(minMonthAnchor);
        return;
      }
    }

    setDateOnDisplay(nextDate);
  }

  return (
    <div className="absolute z-50 bg-white border border-gray-200  shadow-2xl px-4 pt-2 pb-3 w-60 h-60 left-0 top-full mt-2">
      <div className="flex justify-between items-center mb-2">
        <button
          disabled={!canGoPrev}
          onClick={() => onMonthChange("prev")}
          className={`p-1 rounded text-black ${
            canGoPrev ? "hover:bg-gray-100" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <span className="text-xs"> <ChevronLeft /> </span>
        </button>
        <h3 className="font-medium font-montserrat-bold text-black text-xs">
          {dateOnDisplay.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button
          onClick={() => onMonthChange("next")}
          className="p-1 hover:bg-gray-100 rounded text-black"
        >
          <span className="text-xs"><ChevronRight /> </span>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-[10px]">
        {WEEK_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-0.5"
          >
            {day}
          </div>
        ))}
        {generateCalendarDays(dateOnDisplay).map((date, idx) => {
          const isCurrentMonth = date.getMonth() === dateOnDisplay.getMonth();
          const currentTimestamp = getDayTimestamp(date);
          const isSelected =
            selectedTimestamp !== null &&
            currentTimestamp === selectedTimestamp;
          const isToday = currentTimestamp === today.getTime();
          const isDisabled =
            minTimestamp !== null && currentTimestamp < minTimestamp;
          const isInRange =
            hasHighlightRange &&
            highlightMin !== null &&
            highlightMax !== null &&
            currentTimestamp >= highlightMin &&
            currentTimestamp <= highlightMax;
          const isRangeStart =
            rangeStartTimestamp !== null &&
            currentTimestamp === rangeStartTimestamp;
          const isRangeEnd =
            highlightEndTimestamp !== null &&
            currentTimestamp === highlightEndTimestamp;
          const rangeClass =
            isRangeStart || isRangeEnd
              ? isPreviewRange && isRangeEnd
                ? "bg-primary/80 text-white"
                : "bg-primary text-white"
              : isInRange
              ? "bg-primary/20"
              : "";
          return (
            <button
              key={idx}
            onClick={() => {
              if (!isDisabled) onDateSelect(date);
            }}
            disabled={isDisabled}
            onMouseEnter={() => {
              if (onDateHover) onDateHover(date);
            }}
            onMouseLeave={() => {
              if (onDateHoverLeave) onDateHoverLeave();
            }}
            className={`py-1 text-xs font-bold font-montserrat-medium rounded-full text-center ${
              !isCurrentMonth ? "text-gray-500" : "text-gray-900"
              } ${rangeClass} ${
                isSelected ? "border-2 border-gray-400 bg-gray-200" : ""
              } ${
                !isDisabled && !isSelected ? "hover:bg-gray-100" : ""
              } ${
                isToday && !isSelected ? "bg-blue-100" : ""
              } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const generateCalendarDays = (selectedDate) => {
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());

  const days = [];
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    days.push(date);
  }
  return days;
};

export default Calendar;
