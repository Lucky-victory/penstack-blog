import React, { useState } from "react";
import { format, addMonths, subMonths, isToday } from "date-fns";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface CalendarDataItem {
  day: number;
  dayOfWeek: string;
  isToday: boolean;
}

interface CalendarData {
  name: string;
  days: CalendarDataItem[];
}

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function generateCalendarData(date: Date): CalendarData {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthData = {
    name: MONTHS[month],
    days: Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      dayOfWeek: DAYS_OF_WEEK[(firstDayOfMonth + i) % 7],
      isToday: isToday(new Date(year, month, i + 1)),
    })),
  };

  return monthData;
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(selectedDate);
    onDateSelect(selectedDate);
  };

  const currentMonthData = generateCalendarData(currentDate);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button className="prev-month" onClick={handlePrevMonth}>
          <LuChevronLeft />
        </button>
        <div className="current-month">{format(currentDate, "MMMM yyyy")}</div>
        <button className="next-month" onClick={handleNextMonth}>
          <LuChevronRight />
        </button>
      </div>
      <div className="week-days">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="week-day">
            {day}
          </div>
        ))}
      </div>
      <div className="days">
        {Array.from({
          length:
            currentMonthData.days[0].dayOfWeek === "Sun"
              ? 0
              : currentMonthData.days[0].dayOfWeek === "Mon"
              ? 1
              : currentMonthData.days[0].dayOfWeek === "Tue"
              ? 2
              : currentMonthData.days[0].dayOfWeek === "Wed"
              ? 3
              : currentMonthData.days[0].dayOfWeek === "Thu"
              ? 4
              : currentMonthData.days[0].dayOfWeek === "Fri"
              ? 5
              : 6,
        }).map((_, i) => (
          <div key={`empty-${i}`} className="day empty"></div>
        ))}
        {currentMonthData.days.map(({ day, isToday, dayOfWeek }) => (
          <div
            key={day}
            className={`day ${
              selectedDate?.getDate() === day &&
              selectedDate?.getMonth() === currentDate.getMonth()
                ? "selected"
                : ""
            } ${isToday ? "today" : ""}`}
            onClick={() => handleDayClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-footer">
        <button className="done-button">Done</button>
      </div>
    </div>
  );
};

export default Calendar;
