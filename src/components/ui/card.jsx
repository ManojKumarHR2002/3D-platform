// src/components/ui/card.jsx
import React from "react";

export const Card = ({ children, className }) => (
  <div className={`border rounded p-4 shadow ${className || ""}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="mb-2">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);
