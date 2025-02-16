import React, { useState, useEffect } from 'react';

const MedicationDisplay = () => {
    const [rows, setRows] = useState([]);
    const [nextId, setNextId] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRow, setNewRow] = useState({
        start: "",
        stop: "",
        medication: "",
        time: "",
        initial: "",
        site: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "start" || name === "stop") {
            if (value === "" || (Number(value) >= 0 && Number(value) <= 2359)) {
                setNewRow((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setNewRow((prev) => ({ ...prev, [name]: value }));
        }
    };

    const removeRow = (id) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    }

    const addRow = () => {
        const newRowWithId = { ...newRow, id: nextId };
        setRows((prevRows) => [...prevRows, newRowWithId]);
        setNextId((prevId) => prevId + 1);
        setNewRow({
            start: "",
            stop: "",
            medication: "",
            time: "",
            initial: "",
            site: ""
        });
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [isModalOpen]);

    return (
        <div className="relative inline-block">
            <table className="bg-gray-500 w-full h-fit border-collapse table-fixed border-spacing-3">
                <thead>
                    <tr>
                        <th className="border w-1/12">Start</th>
                        <th className="border w-1/12">Stop</th>
                        <th className="border w-7/12">Medication</th>
                        <th className="border w-1/12">Time</th>
                        <th className="border w-1/12">Initial</th>
                        <th className="border w-1/12">Site</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td className="border">{row.start}</td>
                            <td className="border">{row.stop}</td>
                            <td className="border flex justify-between items-center">{row.medication}
                                <button 
                                className="bg-red-500 rounded m-2"
                                onClick={() => removeRow(row.id)}
                                >This is a button</button>
                            </td>
                            <td className="border">{row.time}</td>
                            <td className="border">{row.initial}</td>
                            <td className="border">{row.site}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="rounded bg-pink-500"
                onClick={() => setIsModalOpen(true)}
            > Add Button</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-96">
                        <h2 className="text-xl font-bold text-black mb-4">Add Medication</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Start</label>
                            <input
                                type="number"
                                min="0000"
                                max="2359"
                                name="start"
                                value={newRow.start}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded text-black"
                                placeholder="Im just testin bro"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Stop</label>
                            <input
                                type="number"
                                name="stop"
                                value={newRow.stop}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded text-black"
                                placeholder="Im just testin bro"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Medication</label>
                            <input
                                type="text"
                                name="medication"
                                value={newRow.medication}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded text-black"
                                placeholder="Im just testin bro"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                onClick={addRow}
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MedicationDisplay;