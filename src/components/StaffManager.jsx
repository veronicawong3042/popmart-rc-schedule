import React, { useState, useEffect } from "react";
import StaffList from "./StaffList";
import WeeklySchedule from "./WeeklySchedule";
import Availability from "./Availability"; // updated import path

export default function StaffManager() {
  const STAFF_KEY = "v2_popmart_staff";
  const SCHEDULE_KEY = "v2_popmart_schedule";
  const emptySchedule = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
    Sunday: []
  };

  const [staff, setStaff] = useState(() => {
    const saved = localStorage.getItem(STAFF_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem(SCHEDULE_KEY);
    return saved ? JSON.parse(saved) : emptySchedule;
  });

  useEffect(() => {
    localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  return (
    <div className="p-4">
      <StaffList staff={staff} setStaff={setStaff} />
      <WeeklySchedule staff={staff} schedule={schedule} setSchedule={setSchedule} />

      {/* Add Availability for each staff */}
      {staff.map((person) => (
        <div key={person.id} className="mt-6">
          <h3 className="font-bold mb-2">{person.name}'s Availability</h3>
          <Availability staffId={person.id} />
        </div>
      ))}
    </div>
  );
}
