'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { MedicationOutput } from '../../../components/MedicationDisplay.js';
import Link from 'next/link';

export default function ShowScenario() {
    const [scenario, setScenario] = useState(null);
    const [patient, setPatient] = useState(null);
    const [originalPatient, setOriginalPatient] = useState(null); // Store original values
    const [medications, setMedications] = useState([]);
    const [originalMedications, setOriginalMedications] = useState([]); // Store original values
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editedFields, setEditedFields] = useState({});
    const [studentName, setStudentName] = useState('');
    const [nameError, setNameError] = useState(false); // Add this new state variable

    // Add empty medication template
    const emptyMedication = {
        medication: '',
        start: '',
        stop: '',
        time: '',
        initial: '',
        site: ''
    };

    // Get scenario ID from Next.js router params
    const params = useParams();
    const scenID = params.scenID;

    useEffect(() => {
        // Try to get stored student name from localStorage
        const savedName = localStorage.getItem('studentName');
        if (savedName) {
            setStudentName(savedName);
        }

        const fetchScenarioData = async () => {
            try {
                setIsLoading(true);
                // Fetch the scenario data
                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/get-scenario/${scenID}/`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch scenario data');
                }
                
                const data = await response.json();
                setScenario({
                    id: data.scenario_id,
                    name: data.name,
                    description: data.description
                });

                // Now fetch patient data using the patient ID from the scenario
                const patientResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/get-patient/${data.patient}/`);
                
                if (!patientResponse.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                
                const patientData = await patientResponse.json();
                // Remove owner field if it exists
                const { owner, ...patientWithoutOwner } = patientData;
                
                setPatient(patientWithoutOwner);
                setOriginalPatient({...patientWithoutOwner}); // Store original copy without owner
                
                // Set medications from scenario data
                const medsData = data.medication || [];
                setMedications(medsData);
                setOriginalMedications([...medsData]); // Store original copy
                
                setIsLoading(false);
            } catch (err) {
                setError(err.message);
                setIsLoading(false);
            }
        };

        if (scenID) {
            fetchScenarioData();
        }
    }, [scenID]);

    const handleStudentNameChange = (e) => {
        const name = e.target.value;
        setStudentName(name);
        localStorage.setItem('studentName', name); // Save to localStorage for convenience
    };

    // Handle patient data edits
    const handlePatientChange = (field, value) => {
        setPatient(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Track edited fields
        setEditedFields(prev => ({
            ...prev,
            [`patient_${field}`]: true
        }));
    };

    // Handle medication edits
    const handleMedicationChange = (index, field, value) => {
        const updatedMedications = [...medications];
        updatedMedications[index] = {
            ...updatedMedications[index],
            [field]: value
        };
        setMedications(updatedMedications);
        
        // Track edited fields
        setEditedFields(prev => ({
            ...prev,
            [`medication_${index}_${field}`]: true
        }));
    };

    // Handle adding a new medication
    const handleAddMedication = () => {
        const updatedMedications = [...medications, {...emptyMedication}];
        setMedications(updatedMedications);
        
        // Mark the new medication as edited
        const newIndex = medications.length;
        setEditedFields(prev => ({
            ...prev,
            [`medication_${newIndex}_medication`]: true
        }));
    };

    // Handle download
    const handleDownload = () => {
        // First validate that the student has provided their name
        if (!studentName.trim()) {
            setNameError(true);
            // Scroll to the top to show the error
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return; // Stop execution if no name is provided
        }
        setNameError(false); // Clear any previous error
        
        // Create content for patient data
        let content = "STUDENT: " + studentName + "\n\n";
        content += "SCENARIO INFORMATION\n";
        content += `Name: ${scenario.name}\n`;
        content += `Description: ${scenario.description}\n`;
        content += `ID: ${scenario.id}\n\n`;
        
        content += "PATIENT INFORMATION\n";
        Object.entries(patient).forEach(([key, value]) => {
            // Skip owner field in download
            if (key !== 'owner') {
                const isEdited = editedFields[`patient_${key}`] ? " [EDITED]" : "";
                content += `${key}: ${value}${isEdited}\n`;
            }
        });
        
        content += "\nMEDICATIONS\n";
        medications.forEach((med, index) => {
            content += `\nMedication ${index + 1}:\n`;
            Object.entries(med).forEach(([key, value]) => {
                const isEdited = editedFields[`medication_${index}_${key}`] ? " [EDITED]" : "";
                content += `  ${key}: ${value || 'N/A'}${isEdited}\n`;
            });
        });
        
        // Generate filename with student name and scenario name
        const cleanStudentName = studentName.trim().replace(/[^\w\s]/gi, '');
        const cleanScenarioName = scenario.name.trim().replace(/[^\w\s]/gi, '');
        const fileName = cleanStudentName 
            ? `${cleanStudentName}_${cleanScenarioName}.txt` 
            : `scenario_${scenID}_notes.txt`;
        
        // Create and trigger download
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>;
    }

    if (error) {
        return <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
        </div>;
    }

    return (
        <div className="p-6 max-w-7xl mx-auto text-black">
            {/* Student Name Field */}
            <div className={`mb-6 ${nameError ? 'bg-red-50 border-red-300 border' : 'bg-blue-50'} p-4 rounded-lg shadow`}>
                <label className="block mb-2 font-semibold">
                    Student Name: *
                    <input 
                        type="text" 
                        value={studentName} 
                        onChange={(e) => {
                            handleStudentNameChange(e);
                            if (nameError && e.target.value.trim()) {
                                setNameError(false);
                            }
                        }}
                        placeholder="Enter your name"
                        className={`ml-2 p-2 border ${nameError ? 'border-red-500 bg-red-50' : 'border-gray-300'} rounded w-64`}
                    />
                </label>
                {nameError ? (
                    <p className="text-sm text-red-600 font-medium">Please enter your name before downloading.</p>
                ) : (
                    <p className="text-sm text-gray-500">Your name will be included in the downloaded notes.</p>
                )}
            </div>

            //Scenario Information
            {scenario && (
                <div className="bg-blue-50 p-4 rounded-lg shadow mb-6">
                    <h1 className="text-2xl font-bold mb-2">{scenario.name}</h1>
                    <p className="text-gray-600 mb-2">{scenario.description}</p>
                    <p className="text-sm text-gray-500">Scenario ID: {scenario.id}</p>
                </div>
            )}

            {/* Patient Information */}
            {patient && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 bg-blue-500 text-white p-2 rounded-t">Patient Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(patient).map(([key, value]) => (
                            key !== 'patient_id' && key !== 'owner' && (
                                <div key={key} className="bg-white p-4 rounded shadow">
                                    <p className="font-semibold">{key}</p>
                                    <input 
                                        type="text" 
                                        value={value || ''}
                                        onChange={(e) => handlePatientChange(key, e.target.value)}
                                        className={`w-full p-1 border rounded ${editedFields[`patient_${key}`] ? 'border-yellow-400' : 'border-gray-300'}`}
                                    />
                                    {editedFields[`patient_${key}`] && (
                                        <div className="text-xs text-yellow-600">(edited)</div>
                                    )}
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            //Medication section
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold mb-4 border-b pb-2 bg-blue-500 text-white p-2 rounded-t flex-grow">Medications</h2>
                </div>
                
                {medications.length > 0 ? (
                    <div className="overflow-x-auto">

                        <MedicationOutput initialData={medications}/>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 italic mb-4">No medications found for this scenario.</p>
                        <button
                            onClick={handleAddMedication}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                            Add First Medication
                        </button>
                    </div>
                )}
            </div>

            //Download Button and Revert Changes button
            <div className="mt-8 flex space-x-4">
                <button
                    onClick={handleDownload}
                    className={`px-4 py-2 ${!studentName.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} text-white rounded transition flex items-center`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    Download Notes
                </button>
                
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Revert Changes
                </button>
            </div>
        </div>
    );
}
