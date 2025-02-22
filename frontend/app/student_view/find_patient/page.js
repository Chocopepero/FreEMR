
'use client'

import { useEffect, useState } from 'react'

export default function EnterPatientID() {
    const [patientId, setPatientId] = useState('')

    const handleInputChange = (e) => {
        setPatientId(e.target.value)
    }

    return (
        <div className="bg-blue-500 h-screen">
            <h1 className="text-2xl font-bold mb-4">Enter Patient ID</h1>
            <input
                type="text"
                value={patientId}
                onChange={handleInputChange}
                placeholder="Enter Patient ID"
                className="p-2 m-2 border border-gray-300 text-black"
            />
            <button className="p-2 m-2 bg-blue-300 text-black" onClick={() => window.location.href = `/student_view/show_patient/${patientId}`}>Submit</button>
        </div>
    )
}   

