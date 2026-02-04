import React, { useEffect } from "react";
import { addBreaks } from "../utils/TimeUtils";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];

export default function WeeklySchedule({ staff, schedule, setSchedule }) {
  if (!schedule) return null;

  // Sync schedule with staff list
  useEffect(() => {
    setSchedule(prev => {
      const updated = { ...prev };
      let changed = false;

      days.forEach(day => {
        if (!updated[day]) {
          updated[day] = [];
          changed = true;
        }

        // Add missing staff
        staff.forEach(person => {
          if (!updated[day].some(p => p.id === person.id)) {
            updated[day] = [
              ...updated[day],
              {
                id: person.id,
                name: person.name,
                startTime: "",
                endTime: "",
                breaks: []
              }
            ];
            changed = true;
          }
        });

        // Remove deleted staff
        const staffIds = staff.map(s => s.id);
        const filtered = updated[day].filter(p =>
          staffIds.includes(p.id)
        );

        if (filtered.length !== updated[day].length) {
          updated[day] = filtered;
          changed = true;
        }
      });

      return changed ? updated : prev;
    });
  }, [staff, setSchedule]);

  const handleTimeChange = (day, id, field, value) => {
    const updatedDay = schedule[day].map(person => {
      if (person.id === id) {
        const updatedPerson = { ...person, [field]: value };

        if (updatedPerson.startTime && updatedPerson.endTime) {
          updatedPerson.breaks = addBreaks(
            updatedPerson.startTime,
            updatedPerson.endTime
          );
        }

        return updatedPerson;
      }
      return person;
    });

    setSchedule({ ...schedule, [day]: updatedDay });
  };

  return (
    <div>
      <h2>Weekly Schedule</h2>
      <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Staff</th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {staff.map(person => (
            <tr key={person.id}>
              <td>
                <strong>{person.name}</strong>
                <br />
                <small>{person.role}</small>
              </td>

              {days.map(day => {
                const shift = schedule[day]?.find(
                  s => s.id === person.id
                );

                return (
                  <td key={`${person.id}-${day}`}>
                    <input
                      type="time"
                      value={shift?.startTime || ""}
                      onChange={e =>
                        handleTimeChange(
                          day,
                          person.id,
                          "startTime",
                          e.target.value
                        )
                      }
                    />
                    <input
                      type="time"
                      value={shift?.endTime || ""}
                      onChange={e =>
                        handleTimeChange(
                          day,
                          person.id,
                          "endTime",
                          e.target.value
                        )
                      }
                    />

                    {shift?.breaks?.length > 0 && (
                      <div style={{ fontSize: "10px", color: "blue" }}>
                        Break: {shift.breaks.join(", ")}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
