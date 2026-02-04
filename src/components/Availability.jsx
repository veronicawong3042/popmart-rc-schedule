import React, { useState, useEffect } from "react";

// Utils
const getMonday = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
  return new Date(d.setHours(0, 0, 0, 0));
};

const formatDate = (date) => date.toISOString().split("T")[0];

export default function Availability({ staffId, staffName }) {
  const MAX_WEEKS = 4;

  const todayMonday = getMonday(new Date());
  const [currentMonday, setCurrentMonday] = useState(todayMonday);

  const [availability, setAvailability] = useState(() => {
    const saved = localStorage.getItem("v2_popmart_availability");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("v2_popmart_availability", JSON.stringify(availability));
  }, [availability]);

  // Week days
  const getWeekDays = (monday) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentMonday);

  const nextWeek = () => {
    const next = new Date(currentMonday);
    next.setDate(next.getDate() + 7);
    const diffWeeks = Math.round((next - todayMonday) / (7 * 24 * 60 * 60 * 1000));
    if (diffWeeks < MAX_WEEKS) setCurrentMonday(next);
  };

  const prevWeek = () => {
    const prev = new Date(currentMonday);
    prev.setDate(prev.getDate() - 7);
    if (prev >= todayMonday) setCurrentMonday(prev);
  };

  // Availability functions
  const addUnavailable = (dateStr, startTime, endTime) => {
    setAvailability((prev) => {
      const staffAvail = prev[staffId] || {};
      const dayAvail = staffAvail[dateStr]?.filter(s => !s.fullDay) || [];
      return {
        ...prev,
        [staffId]: {
          ...staffAvail,
          [dateStr]: [...dayAvail, { startTime, endTime, fullDay: false }],
        },
      };
    });
  };

  const toggleFullDay = (dateStr) => {
    setAvailability((prev) => {
      const staffAvail = prev[staffId] || {};
      const daySlots = staffAvail[dateStr] || [];
      if (daySlots.some(s => s.fullDay)) {
        const filtered = daySlots.filter(s => !s.fullDay);
        return {
          ...prev,
          [staffId]: { ...staffAvail, [dateStr]: filtered },
        };
      }
      return {
        ...prev,
        [staffId]: { ...staffAvail, [dateStr]: [{ fullDay: true }] },
      };
    });
  };

  const removeUnavailable = (dateStr, index) => {
    setAvailability((prev) => {
      const staffAvail = prev[staffId] || {};
      const dayAvail = [...(staffAvail[dateStr] || [])];
      dayAvail.splice(index, 1);
      return {
        ...prev,
        [staffId]: { ...staffAvail, [dateStr]: dayAvail },
      };
    });
  };

  return (
    <div className="p-4 border rounded shadow-sm mb-6">
      <div className="flex justify-between mb-4">
        <button onClick={prevWeek} className="px-2 py-1 bg-gray-300 rounded">◀</button>
        <h3 className="text-lg font-bold">
          Week of {formatDate(currentMonday)}
        </h3>
        <button onClick={nextWeek} className="px-2 py-1 bg-gray-300 rounded">▶</button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day} className="border px-2 py-1 bg-gray-100 text-center">
                {day.toLocaleDateString("en-US", { weekday: "short" })}<br />
                {formatDate(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weekDays.map((day) => {
              const dateStr = formatDate(day);
              const daySlots = availability[staffId]?.[dateStr] || [];
              const fullDay = daySlots.some(s => s.fullDay);

              return (
                <td key={dateStr} className="border p-2 align-top">
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={fullDay}
                      onChange={() => toggleFullDay(dateStr)}
                      className="mr-1"
                    />
                    <span className="text-sm">Full Day Unavailable</span>
                  </div>

                  {!fullDay && daySlots.map((slot, i) => (
                    <div key={i} className="flex items-center mb-1">
                      <span className="text-sm mr-1">{slot.startTime} - {slot.endTime}</span>
                      <button
                        className="text-red-500 text-xs"
                        onClick={() => removeUnavailable(dateStr, i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {!fullDay && (
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const start = e.target.start.value;
                      const end = e.target.end.value;
                      if (start && end) {
                        addUnavailable(dateStr, start, end);
                        e.target.reset();
                      }
                    }}>
                      <input type="time" name="start" className="border px-1 py-0.5 text-xs w-20 mr-1" />
                      <input type="time" name="end" className="border px-1 py-0.5 text-xs w-20 mr-1" />
                      <button type="submit" className="bg-blue-500 text-white px-1 rounded text-xs">Add</button>
                    </form>
                  )}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
