"use client";
import React, { useState, useEffect } from 'react';
import FormComponent from '../components/FormComponent';
import NotesComponent from '../components/NotesComponent';
import { MedicationInput } from '../components/MedicationDisplay';

// Scenario_ID for editing. If nothing is passed it, set to null and disregard it.
export default function ScenarioCreation({ scenarioId = null }) {
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
  const [loading, setLoading] = useState(true);


  const useExistingData = async () => {
    if (scenarioId) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/single-scenario/${scenarioId}/`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch scenario data');
        }

        const data = await response.json();
        console.log('Fetched data:', data);
        if (data.patient) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/get-patient/${data.patient}`, {
              credentials: 'include',
            });
            if (!response.ok) {
              throw new Error('Failed to fetch patient data');
            }
            const patientData = await response.json();
            console.log('Fetched patient data:', patientData);
            setFormData((prev) => ({
              ...prev,
              patient: {
                patient_id: patientData.patient_id || "",
                name: patientData.name || "",
                dob: patientData.dob || "",
                sex: patientData.sex || "",
                room_num: patientData.room_num || "",
                height: patientData.height || "",
                weight: patientData.weight || "",
              }
            }));
          }
          catch(error){
            console.error('Error fetching patient data:', error);
          }
        }

        setFormData((prev) => ({
          ...prev,
          scenario_id: data.scenario_id || "",
          name: data.name || "",
          description: data.description || "",
          medications: Array.isArray(data.medications) ? data.medications : [],
          notes: Array.isArray(data.notes) ? data.notes : [],
        }));
      } catch (error) {
        console.error('Error fetching scenario data:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scenarioId) {
      useExistingData();
    } else {
      setLoading(false);
    }
  }, [scenarioId]);


  useEffect(() => {
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

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleSubmit = async () => {
    const csrfToken = getCookie('csrftoken');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/submit-scenario/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Success:', data);
      router.push('/scenario');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function getContentForButton(selectedButton) {
    if (selectedButton === 'Patient Info') {
      return (
        <div className="flex">
          <div className="bg-blue-500">
            <FormComponent
              formData={{
                patient_id: formData.patient.patient_id || "",
                name: formData.patient.name || "",
                dob: formData.patient.dob || "",
                sex: formData.patient.sex || "",
                room_num: formData.patient.room_num || "",
                height: formData.patient.height || "",
                weight: formData.patient.weight || "",
              }}
              onFormChange={handleFormChange}
            />

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
    } else if (selectedButton === 'Scenario Info') {
      return (
        <div className="bg-yellow-500 flex flex-col justify-center items-center p-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Scenario Name:
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <label className="block text-gray-700 text-sm font-bold mt-4 mb-2">
            Scenario Description:
          </label>
          <textarea
            value={formData.description || ""
            }
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
      );
    }
    return null;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-grow flex h-[calc(100vh-80px)]">
      <div className="w-1/6 content-center justify-center justify-items-center bg-red-300 sticky top-16 h-[calc(100vh-80px)] overflow-y-auto">
        <div className="text-gray-700 p-4 bg-blue-600 w-full" onClick={() => handleButtonClick('Scenario Info')}>
          Scenario Info
        </div>
        <div className="text-gray-700 mt-4 p-4 bg-blue-200 w-full" onClick={() => handleButtonClick('Patient Info')}>
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