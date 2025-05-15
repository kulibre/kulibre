import React from "react";

export default function CalendarMinimal() {
  console.log("Minimal Calendar component rendering");
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Calendar</h1>
      <p className="mb-4">This is a minimal calendar page for testing.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>If you can see this, the Calendar component is working at a basic level.</p>
        <p className="mt-2">The issue might be with one of the subcomponents or data fetching.</p>
      </div>
    </div>
  );
}