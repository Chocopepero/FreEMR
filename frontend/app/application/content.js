"use client";

import FormComponent from '../components/FormComponent';
import DisplayPatient from '../components/DisplayPatient';
import { MedicationInput } from '../components/MedicationDisplay';
import React, { useState } from 'react';

export default function ApplicationContent() {
  const [patientId, setPatientId] = useState('');
  const [selectedButton, setSelectedButton] = useState('Patient Info');

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleInputChange = (e) => {
    setPatientId(e.target.value);
  };


  function getContentForButton(selectedButton) {
    if (selectedButton === 'Patient Info') {
      return (
        <div className="flex">
          <div className="bg-blue-500 h-screen">
            {/* 
          This component includes a top side margin in components/styles.module.css
          If we want to remove that, delete the style and use tailwind in-line css 
          */}
            <FormComponent />
          </div>
          <MedicationInput />
          {/* <input
              type="text"
              value={patientId}
              onChange={handleInputChange}
              placeholder="Enter Patient ID"
              className="p-2 m-2 border border-gray-300"
            /> */}
          {/* {patientId && <DisplayPatient patientId={patientId} />} */}
        </div>)
    } else if (selectedButton === 'Notes') {
      return (
        <div className="bg-gray-500 h-screen flex flex-col justify-center items-center">
          <textarea className="resize-none rounded m-4 p-4 w-3/4 h-1/4" />
          <textarea className="resize-none rounded m-4 p-4 w-3/4 h-1/4" />
          <textarea className="resize-none rounded m-4 p-4 w-3/4 h-1/4" />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex">
      <div className="w-1/6 h-screen content-center justify-center justify-items-center bg-red-300">
        <div className="text-gray-700 p-4 bg-blue-200 w-full" onClick={() => handleButtonClick('Patient Info')}>
          Patient Info
        </div>
        <div className="text-gray-700 mt-4 p-4 bg-blue-400 w-full" onClick={() => handleButtonClick('Notes')}>
          Notes
        </div>
      </div>
      <div className="w-5/6 h-screen bg-green-300">
        {getContentForButton(selectedButton)}
      </div>
    </div>
  );
}
