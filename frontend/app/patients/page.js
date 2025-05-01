'use client';
import { useState, useEffect } from 'react';
import withAuth from '../components/AuthComponent';
import Link from 'next/link';
import FormComponent from '../components/FormComponent';

const defaultFormData = {
    patient: {
        patient_id: "",
        name: "",
        dob: "",
        sex: "",
        room_num: "",
        height: "",
        weight: ""
    }
};

function PatientPage() {
    const [user, setUser] = useState(null);
    const [patient, setPatient] = useState([]);
    const [error, setError] = useState(null);
    const [modalError, setModalError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(defaultFormData)

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/get_user_patients/`, {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch patient data');
                }
                return response.json();
            })
            .then(data => setPatient(data.patients || []))
            .catch(err => setError(err.message));

        async function fetchUser() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/current_user/`,
                    {
                        credentials: 'include',
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        }
        fetchUser();
    }, []);


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

    const validateData = () => {
        const emptyFields = []
        for (const key in formData.patient) {
            if (!formData.patient[key] || formData.patient[key].trim() === "") {
                emptyFields.push(key);
            }
        }
        return emptyFields;
    }

    const closeModal = () => {
        setModalError(null);
        setIsModalOpen(false);
        setFormData(defaultFormData)
    }

    const handleSubmitClick = async (e) => {
        setModalError(null);
        e.preventDefault();
        const errors = validateData();
        const csrfToken = getCookie('csrftoken');
        if (errors.length > 0) {
            setModalError(`All fields are required: ${errors.join(', ')}`);
        } else {
            try {
                const updatedPatientData = {
                    ...formData.patient,
                    owner: user?.user_id,
                };

                const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/submit-patient/`, {
                    method: 'POST',
                    mode: 'cors',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPatientData),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const formattedError = Object.entries(errorData)
                        .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
                        .join(' ');
                    setModalError(formattedError);
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('Success:', data);
                setPatient(data.patients || []);
                closeModal();
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        }
    };

    const handleDeleteClick = (patient_id) => {
        const csrfToken = getCookie('csrftoken');
        fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/delete-patient/${patient_id}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete patient data');
                }
                return response.json();
            })
            .then(data => setPatient(data.patients || []))
            .catch(err => {
                console.error('Delete error:', err);
                setError(err.message);
            });
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const handleFormChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            patient: {
                ...prev.patient,
                [name]: value
            }
        }));
    };

    const handleClickCancel = () => {
        setModalError(null);
        setFormData(defaultFormData);
        setIsModalOpen(false);
    }

    return (
        <div className="relative w-full min-h-[calc(100vh-80px)] bg-gray-300 text-black p-4">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="table-fixed overflow-x-auto border-collapse border border-gray-400 w-full min-w-md">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2 w-2/5">Patient ID</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patient.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-4 py-2">{item.patient_id}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-400 px-4 py-2 flex justify-center items-center">
                                    {user && user.user_id == item.owner ? (
                                        <div>                           
                                            <button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold ml-4 py-2 px-4 rounded transition"
                                                onClick={() => handleDeleteClick(item.patient_id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <h2>Sample Patient</h2>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button
                className="bg-red-500 p-4 rounded-full absolute right-10 bottom-10 transition shadow-lg shadow-red-500/50 hover:bg-red-700 hover:shadow-xl hover:shadow-red-700/50 text-white"
                onClick={() => handleOpenModal()}
            >
                Add Patient
            </button>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex w-full max-w-4xl">
                        <div className="bg-white p-6 rounded shadow-md flex-grow">
                            <form onSubmit={handleSubmitClick}>
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
                                    wrapInForm={false}
                                    hideSubmitButton={true}
                                    onSubmit={handleSubmitClick}
                                />
                                {modalError && (
                                    <div className="w-full justify-items-start text-red-500">
                                        {modalError}
                                    </div>
                                )}
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                        onClick={handleClickCancel}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(PatientPage);