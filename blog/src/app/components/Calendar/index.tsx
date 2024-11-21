import React, { useState, useMemo, useCallback, useRef } from "react";
import { format, addMonths, subMonths, isToday } from "date-fns";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Swiper, SwiperSlide, SwiperRef } from "swiper/react";
import { Keyboard, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

interface CalendarDataItem {
  day: number;
  dayOfWeek: string;
  isToday: boolean;
}

interface CalendarData {
  name: string;
  month: number;
  year: number;
  days: CalendarDataItem[];
}

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  startDate?: Date;
  endDate?: Date;
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

function generateMonthData(date: Date): CalendarData {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  return {
    name: MONTHS[month],
    month,
    year,
    days: Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      dayOfWeek: DAYS_OF_WEEK[(firstDayOfMonth + i) % 7],
      isToday: isToday(new Date(year, month, i + 1)),
    })),
  };
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  startDate = new Date(new Date().getFullYear() - 1, 0, 1),
  endDate = new Date(new Date().getFullYear() + 1, 11, 31),
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const swiperRef = useRef<SwiperRef>(null);

  // Generate sliding window of 3 months
  const [multiMonthData, setMultiMonthData] = useState<CalendarData[]>(() => {
    return [
      generateMonthData(subMonths(currentDate, 1)),
      generateMonthData(currentDate),
      generateMonthData(addMonths(currentDate, 1)),
    ];
  });

  // Handle navigation through swiper or buttons
  const handleNavigation = useCallback(
    (direction: "prev" | "next") => {
      const newDate =
        direction === "prev"
          ? subMonths(currentDate, 1)
          : addMonths(currentDate, 1);

      // Ensure new date is within allowed range
      if (newDate >= startDate && newDate <= endDate) {
        setCurrentDate(newDate);

        if (direction === "prev") {
          // Remove last month, add new month at the start
          setMultiMonthData((prev) => [
            generateMonthData(subMonths(newDate, 1)),
            ...prev.slice(0, -1),
          ]);
        } else {
          // Remove first month, add new month at the end
          setMultiMonthData((prev) => [
            ...prev.slice(1),
            generateMonthData(addMonths(newDate, 1)),
          ]);
        }

        // Manually update swiper to center slide
        if (swiperRef.current) {
          swiperRef.current.swiper.slideTo(1);
        }
      }
    },
    [currentDate, startDate, endDate]
  );

  const handleDayClick = (day: number, monthOffset: number) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + monthOffset,
      day
    );

    // Validate date selection within range
    // if (targetDate >= startDate && targetDate <= endDate) {
    setSelectedDate(targetDate);
    onDateSelect(targetDate);
    // }
  };

  // Handle swiper slide change
  const handleSlideChange = useCallback(
    (swiper: any) => {
      const newIndex = swiper.activeIndex;

      if (newIndex === 0) {
        handleNavigation("prev");
      } else if (newIndex === 2) {
        handleNavigation("next");
      }
    },
    [handleNavigation]
  );

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button
          className="prev-month"
          onClick={() => swiperRef.current?.swiper.slidePrev()}
        >
          <LuChevronLeft />
        </button>
        <div className="current-month">{format(currentDate, "MMMM yyyy")}</div>
        <button
          className="next-month"
          onClick={() => swiperRef.current?.swiper.slideNext()}
        >
          <LuChevronRight />
        </button>
      </div>

      <Swiper
        ref={swiperRef}
        modules={[Navigation, Keyboard]}
        // navigation={{
        //   prevEl: ".prev-month",
        //   nextEl: ".next-month",
        // }}
        keyboard={{ enabled: true }}
        initialSlide={1}
        spaceBetween={10}
        slidesPerView={1}
        onSlideChange={handleSlideChange}
      >
        {multiMonthData.map((monthData, monthIndex) => (
          <SwiperSlide
            key={`${monthData.year}-${monthData.month}-${monthIndex}`}
          >
            <div className="calendar-month">
              <div className="week-days">
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className="week-day">
                    {day}
                  </div>
                ))}
              </div>
              <div className="days">
                {/* Empty days before the first day of the month */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                  .slice(0, DAYS_OF_WEEK.indexOf(monthData.days[0].dayOfWeek))
                  .map((_, i) => (
                    <div key={`empty-${i}`} className="day empty"></div>
                  ))}

                {monthData.days.map(({ day, isToday, dayOfWeek }) => (
                  <div
                    key={day}
                    className={`day 
                      ${
                        selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() ===
                          currentDate.getMonth() + monthIndex - 1
                          ? "selected"
                          : ""
                      } 
                      ${isToday ? "today" : ""}`}
                    onClick={() => handleDayClick(day, monthIndex - 1)}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="calendar-footer">
        <button
          className="done-button"
          onClick={() => selectedDate && onDateSelect(selectedDate)}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default Calendar;
