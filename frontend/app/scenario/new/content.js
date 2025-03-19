"use client";
import React, { useState, useEffect } from 'react';
import FormComponent from '../../components/FormComponent';
import NotesComponent from '../../components/NotesComponent';
import { MedicationInput } from '../../components/MedicationDisplay';

export default function ApplicationContent() {
  const [patientId, setPatientId] = useState('');
  const [selectedButton, setSelectedButton] = useState('Patient Info');
  const [formData, setFormData] = useState({
    scenario_id: "",
    name: "",
    description: "",
    patient: {
      patient_id: "",
      name: "",
      dob: "",
      sex: "",
      room_num: "",
      height: "",
      weight: ""
    },
    medications: [],
    notes: []
  });

  useEffect(() => {
    console.log('Current state:', { selectedButton, formData });
  }, [selectedButton, formData]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      patient: {
        ...prev.patient,
        [name]: value
      }
    }));
  };

  const addMedication = (newRow) => {
    setFormData((prev) => ({
      ...prev,
      medications: [...prev.medications, { ...newRow, id: prev.medications.length + 1 }],
    }));
  };

  const removeMedication = (id) => {
    setFormData((prev) => ({
      ...prev,
      medications: prev.medications.filter((row) => row.id !== id),
    }));
  };

  const addNote = (newNote) => {
    setFormData((prev) => ({
      ...prev,
      notes: [...prev.notes, newNote],
    }));
  };
  
  const removeNote = (noteId) => {
    setFormData((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== noteId),
    }));
  };

  const handleButtonClick = (button) => {
    setSelectedButton(button);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/submit-scenario/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function getContentForButton(selectedButton) {
    if (selectedButton === 'Patient Info') {
      return (
        <div className="flex">
          <div className="bg-blue-500">
            <FormComponent formData={formData.patient} onFormChange={handleFormChange}/>
          </div>
          <MedicationInput
            rows={formData.medications}
            addRow={addMedication}
            removeRow={removeMedication} />
        </div>
      );
    } else if (selectedButton === 'Notes') {
      return (
        <div className="bg-gray-500 flex flex-col justify-center items-center">
          <NotesComponent addNote={addNote} removeNote={removeNote} notes={formData.notes} />
        </div>
      );
    }
    return null;
  }

  return (
    <div className="flex-grow flex h-[calc(100vh-80px)]">
      <div className="w-1/6 content-center justify-center justify-items-center bg-red-300 sticky top-16 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="text-gray-700 p-4 bg-blue-200 w-full" onClick={() => handleButtonClick('Patient Info')}>
          Patient Info
        </div>
        <div className="text-gray-700 mt-4 p-4 bg-blue-400 w-full" onClick={() => handleButtonClick('Notes')}>
          Notes
        </div>
        <button onClick={handleSubmit} className="p-2 m-2 bg-blue-500 text-white">Submit</button>
      </div>
      <div className="w-5/6 bg-green-300 overflow-y-auto">
        {getContentForButton(selectedButton)}
      </div>
    </div>
  );
}