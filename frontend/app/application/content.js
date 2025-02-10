"use client";

import React, { useState } from 'react';

async function fetchData() {
  const res = await fetch(`${process.env.APP_BACKEND_URL}/api/application-data`, {
    cache: "no-store", // Ensure fresh data on each load
  });
  return res.json();
}

export default function ApplicationContent() {
  const [selectedButton, setSelectedButton] = useState(null);

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  return (
    <div className="flex">
      <div className="w-1/6 h-screen content-center justify-center justify-items-center bg-red-300">
        <div className="p-4 bg-blue-200" onClick={() => handleButtonClick('Button 1')}>
          Button 1
        </div>
        <div className="mt-4 p-4 bg-blue-400" onClick={() => handleButtonClick('Button 2')}>
          Button 2
        </div>
      </div>
      <div className="w-5/6 h-screen bg-green-300">
        {selectedButton === 'Button 1' && <h1>Content for Button 1</h1>}
        {selectedButton === 'Button 2' && <h1>Content for Button 2</h1>}
        {!selectedButton && <h1>Test</h1>}
      </div>
    </div>
  );
}
