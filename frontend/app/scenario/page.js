'use client';
import { useState, useEffect } from 'react';
import withAuth from '../components/AuthComponent';
import Link from 'next/link';

function ScenarioPage() {
    const [scenario, setScenario] = useState([]);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        fetch(`/api/scenario-data/`, {
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

    const handleDeleteClick = (scenario_id) => {
        const csrfToken = getCookie('csrftoken');
        fetch(`/api/delete-scenario/${scenario_id}/`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'X-CSRFToken': csrfToken
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete scenario data');
                }
                return response.json();
            })
            .then(data => setScenario(data.scenarios || []))
            .catch(err => {
                console.error('Delete error:', err);
                setError(err.message);
            });
    }

    const copyLinkToClipboard = (scenario_id) =>{
        const link = `${window.location.origin}/student_view/show_scenario/${scenario_id}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy link:', err);
                alert('Failed to copy link');
            });
    }


    return (
        <div className="relative w-full min-h-[calc(100vh-80px)] bg-gray-300 text-black p-4">
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <table className="table-fixed overflow-x-auto border-collapse border border-gray-400 w-full min-w-md">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2 w-2/5">Scenario ID</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Description</th>
                            <th className="border border-gray-400 px-4 py-2">Patient</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/5">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scenario.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-4 py-2">{item.scenario_id}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.description}</td>
                                <td className="border border-gray-400 px-4 py-2">{item.patient_name}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        <button
                                                type='button'
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
                                                onClick={() => copyLinkToClipboard(item.scenario_id)}
                                            >Link</button>

                                        <Link
                                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
                                            href={`/scenario/edit/${item.scenario_id}`}
                                        >
                                            Edit
                                        </Link>

                                        <button
                                            type='button'
                                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition"
                                            onClick={() => handleDeleteClick(item.scenario_id)}
                                        >Delete</button>
                                    </div>
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