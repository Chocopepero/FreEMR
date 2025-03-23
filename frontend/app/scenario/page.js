'use client';
import { useState, useEffect } from 'react';
import withAuth from '../components/AuthComponent';
import Link from 'next/link';

function ScenarioPage() {
    const [scenario, setScenario] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/scenario-data/`, {
            credentials: 'include',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch scenario data');
                }
                return response.json();
            })
            .then(data => setScenario(data.scenarios || []))
            .catch(err => setError(err.message));
    }, []);

    return (
        <div className="relative w-full h-[calc(100vh-80px)] bg-gray-300 text-black p-4">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="table-auto border-collapse border border-gray-400 w-full">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">Scenario ID</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Description</th>
                            <th className="border border-gray-400 px-4 py-2">Patient</th>
                            <th className="border border-gray-400 px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenario.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-4 py-2">{item.scenario_id}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.patient}</td>
                                <td className="border border-gray-400 px-4 py-2 flex justify-center items-center">
                                    <Link 
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    href={`/scenario/edit/${item.scenario_id}`}
                                >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <Link 
            className="bg-red-500 p-4 rounded-full absolute right-10 bottom-10 transition shadow-lg shadow-red-500/50 hover:bg-red-700 hover:shadow-xl hover:shadow-red-700/50 text-white"
            href="/scenario/new"
            >
                Add Scenario
            </Link>
        </div>
    );
}

export default withAuth(ScenarioPage);