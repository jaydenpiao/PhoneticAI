import React, { useState } from "react";

const Calendar = ({ renderTags, tagTypeStates }) => {
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const dates = Array.from(
    { length: getDaysInMonth(currentMonth, currentYear) },
    (_, i) => i + 1
  );

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const setMonth = (month) => {
    if (month < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (month > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(month);
    }
  };

  return (
    <div className="">
      <div className="w-full max-w-full">
        <div className="flex justify-center items-center space-x-2 mb-2">
          <button onClick={() => setMonth(currentMonth - 1)}>{"<"}</button>
          <h2>{`${new Date(currentYear, currentMonth).toLocaleString(
            "default",
            { month: "long" }
          )} ${currentYear}`}</h2>
          <button onClick={() => setMonth(currentMonth + 1)}>{">"}</button>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="text-center text-sm">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }, (_, index) => (
            <div key={index} className="border h-24"></div>
          ))}
          {dates.map((date, index) => (
            <div key={index} className="border h-24">
              <div className="text-center">{date}</div>
              <div className="overflow-y-auto">
                {/* Pass tagTypeStates to renderTags */}
                {renderTags(date, currentYear, currentMonth, tagTypeStates)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
