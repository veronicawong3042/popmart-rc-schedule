import React, { useState } from "react";

export default function StaffList({ staff, setStaff }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Sales Associate");

  const addStaff = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // This updates the PARENT state, which triggers the localStorage save
    const newPerson = { id: Date.now(), name: name.trim(), role };
    setStaff((prev) => [...prev, newPerson]);
    setName("");
  };

  const deleteStaff = (id) => {
    setStaff((prev) => prev.filter((member) => member.id !== id));
  };

  return (
    <div className="mb-8">
      <form onSubmit={addStaff} className="flex gap-2 mb-4">
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Staff Name"
          className="border p-2 rounded"
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 rounded">
          <option>Store Manager</option>
          <option>Assistant Manager</option>
          <option>Sales Lead</option>
          <option>Sales Associate</option>
          <option>Stock Lead</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 rounded">Add</button>
      </form>
      
      <ul className="space-y-2">
        {staff.map((person) => (
          <li key={person.id} className="flex justify-between w-64 bg-gray-100 p-2 rounded">
            {person.name} ({person.role})
            <button onClick={() => deleteStaff(person.id)} className="text-red-500">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}