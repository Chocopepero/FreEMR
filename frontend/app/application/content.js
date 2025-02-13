"use client";

import FormComponent from '../components/FormComponent';
import DisplayPatient from '../components/DisplayPatient';
import React, { useState } from 'react';

export default function ApplicationContent() {
  const [patientId, setPatientId] = useState('');
  const [selectedButton, setSelectedButton] = useState('Button 1');

  const handleButtonClick = (button) => {
  };
  
  const handleInputChange = (e) => {
    setPatientId(e.target.value);
  };


  function getContentForButton(selectedButton) {
    if (selectedButton === 'Button 1') {
      return (
        <div className="flex">
          <div className="bg-blue-500 h-screen">
            {/* 
          This component includes a top side margin in components/styles.module.css
          If we want to remove that, delete the style and use tailwind in-line css 
          */}
            <FormComponent />
          </div>
          <div className="w-1/2 h-screen bg-gray-500">
            <input
              type="text"
              value={patientId}
              onChange={handleInputChange}
              placeholder="Enter Patient ID"
              className="p-2 m-2 border border-gray-300"
            />
            {patientId && <DisplayPatient patientId={patientId} />}
          </div>
        </div>)
    } else if (selectedButton === 'Button 2') {
      return (
        <div className="bg-gray-500 h-screen">

        </div>
      );
    }
    return null;
  }

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
        {getContentForButton(selectedButton)}
      </div>
    </div>
  );
}
