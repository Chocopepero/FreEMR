
'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ShowPatient() {
    const [patient, setPatient] = useState(null)
    const [error, setError] = useState(null)
    // Get patient ID from Next.js router params
    const params = useParams();
    const patientId = params.id;
    useEffect(() => {

        fetch(`/api/get-patient/${patientId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch patient data')
                }
                return response.json()
            })
            .then(data => setPatient(data))
            .catch(err => setError(err.message))
    }, [])

    if (error) return <div>Error: {error}</div>
    if (!patient) return <div>Loading...</div>

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Patient Information</h1>
            <div>
            <strong>Patient ID: </strong>
            <span>{patientId}</span>
            </div>
            <div className="grid gap-2">
            {Object.entries(patient).map(([key, value]) => (
                //Ignore patient_id key as it is already displayed above
                key !== 'patient_id' &&
                <div key={key} className="border p-2">
                <strong>{key}: </strong>
                <input 
                    className="border-none text-black" 
                    defaultValue={value?.toString()}
                    onChange={(e) => {
                    setPatient(prev => ({
                        ...prev,
                        [key]: e.target.value
                    }))
                    }}
                />
                </div>
            ))}
            <button 
                onClick={() => {
                    const content = Object.entries(patient)
                    .filter(([key]) => key !== 'patient_id')
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('\n');
                    
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `patient_${patientId}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                Download Patient Data
                </button>
            </div>
        </div>
        )
}