import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";


const WEEK_DAYS = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
const GUEST_OPTIONS = Array.from({ length: 11 }, (_, i) => i);

// Composant Calendrier
const Calendar = ({
  selectedDate,
  onDateSelect,
}) => {

  if(!(selectedDate instanceof Date)){
    const d = selectedDate.split("/").reverse().join("/");
    selectedDate = new Date(d);
  }

  const [dateOnDisplay,setDateOnDisplay] = useState(selectedDate);

  function onMonthChange(direction){
    const month = direction === "next" ?  (dateOnDisplay.getMonth() + 1) % 11 : Math.max(0,dateOnDisplay.getMonth() - 1) //max month is 11 as it starts to 0 and ends at 11
    const nextDate = new Date(
      dateOnDisplay.getFullYear(),
      month,
      dateOnDisplay.getDate()
    );
    setDateOnDisplay(nextDate);
  }

  return (
    <div className="absolute z-50 bg-white border border-gray-200  shadow-2xl px-4 pt-2 pb-3 w-60 h-60 left-0 top-full mt-2">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => onMonthChange("prev")}
          className="p-1 hover:bg-gray-100 rounded text-black"
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
          const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
          const isToday = isCurrentMonth && date.toDateString() === selectedDate.toDateString();
          const isSelected = isToday && isCurrentMonth;
          return (
            <button
              key={idx}
              onClick={() => onDateSelect(date)}
              className={`py-1 text-xs font-bold font-montserrat-medium rounded-full text-center ${
                !isCurrentMonth ? "text-gray-500" : "text-gray-900"
              } ${isSelected ? "border-2 border-gray-400 bg-gray-200" : "hover:bg-gray-100"} ${
                isToday && !isSelected ? "bg-blue-100" : ""
              }`}
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