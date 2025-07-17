// src/components/ui/select.jsx
import React from "react";

export const Select = ({ label, value, onChange, children }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-2 w-full"
    >
      {children}
    </select>
  </div>
);

export const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);
