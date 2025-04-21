import React, { useState } from 'react';

const DisplayPatient = ({ patientId }) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPatientData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/get-patient/${patientId}/`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientData(data);
      } else {
        setError('Failed to fetch patient data');
      }
    } catch (error) {
      setError('An error occurred while fetching patient data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchPatientData} className="p-2 m-2 border border-gray-300">
        Fetch Patient Data
      </button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      {patientData ? (
        <div>
          <h2>Patient Details</h2>
          <p><strong>Name:</strong> {patientData.name}</p>
          <p><strong>Date of Birth:</strong> {patientData.dob}</p>
          <p><strong>Sex:</strong> {patientData.sex}</p>
          <p><strong>Patient ID:</strong> {patientData.patient_id}</p>
          <p><strong>Room Number:</strong> {patientData.room_num}</p>
          <p><strong>Height:</strong> {patientData.height}</p>
          <p><strong>Weight:</strong> {patientData.weight}</p>
        </div>
      ) : (
        <div>No patient data available</div>
      )}
    </div>
  );
};

export default DisplayPatient;