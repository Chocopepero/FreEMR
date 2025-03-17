import React, { useState, useEffect } from 'react';

// Medication Input is for instructors to create a medication list for a patient.
// Medication Output is to be used for scenarios.
// The main difference between them is that Medication Input has a button to add a new row and a button to remove a row.

const MedicationInput = ({ rows, addRow, removeRow }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRow, setNewRow] = useState({
        ndc: "",
        start: "",
        stop: "",
        medication: "",
        time: "",
        initial: "",
        site: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name !== "start" && name !== "stop" || value === "" || (Number(value) >= 0 && Number(value) <= 2359)) {
            setNewRow((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleAddRow = () => {
        addRow(newRow);
        setNewRow({
            ndc: "",
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
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    }, [isModalOpen]);

    return (
        <div className="relative inline-block">
            <table className="bg-gray-500 w-full h-fit border-collapse table-fixed border-spacing-3">
                <thead>
                    <tr>
                        <th className="border w-3/12">Medication ID</th>
                        <th className="border w-1/12">Start</th>
                        <th className="border w-1/12">Stop</th>
                        <th className="border w-7/12">Medication</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.id}>
                            <td className="border">{row.ndc}</td>
                            <td className="border">{row.start}</td>
                            <td className="border">{row.stop}</td>
                            <td className="border flex justify-between items-center">{row.medication}
                                <button
                                    className="bg-red-500 rounded m-2"
                                    onClick={() => removeRow(row.id)}
                                >This is a button</button>
                            </td>
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
                            <label className="block text-gray-700">Medication ID</label>
                            <input
                                type="text"
                                name="ndc"
                                value={newRow.ndc}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border rounded text-black"
                                placeholder="Medication ID"
                            />
                        </div>
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
                                placeholder="0000 - 2359"
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
                                placeholder="0000 - 2359"
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
                                placeholder="Medication Name"
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
                                onClick={handleAddRow}
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

const MedicationOutput = ({ initialData }) => {
    const [rows, setRows] = useState(initialData || []);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [textareaContent, setTextareaContent] = useState('');
    const [formData, setFormData] = useState({
        time: "",
        initial: "",
        site: ""
    });
    const [isNdcMatched, setIsNdcMatched] = useState(false);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value === '') {
            setTextareaContent('');
        } else if (selectedRow && value === selectedRow.ndc) {
            setTextareaContent('Matched content');
            setIsNdcMatched(true);
        } else {
            setTextareaContent('Not matched content');
            setIsNdcMatched(false);
        }
    };

    const handleAdd = () => {
        if (selectedRow && isNdcMatched) {
            const updatedRows = rows.map((row) =>
                row.id === selectedRow.id ? { ...row, ...formData } : row
            );
            setRows(updatedRows);
            setIsModalOpen(false);
            setIsNdcMatched(false);
            setInputValue('');
            setTextareaContent('');
        } else {
            alert("Medication doesn't match. Please scan the correct medication.");
        }

    };

    const handleOpenModal = (row) => {
        setSelectedRow(row);
        setFormData({
            time: row.time || "",
            initial: row.initial || "",
            site: row.site || "",
            ndc: row.ndc || ""
        });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleClickCancel = () => {
        setIsModalOpen(false);
        setIsNdcMatched(false);
        setInputValue('');
        setTextareaContent('');
    }

    const getTextAreaColor = (textareaContent) => {
        if (textareaContent === '') {
            return '';
        }
        return isNdcMatched ? 'bg-green-200' : 'bg-red-200';
    }


    useEffect(() => {
        document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
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
                            <td className="border p-1">{row.start}</td>
                            <td className="border p-1">{row.stop}</td>
                            <td className="border p-1 flex justify-between items-center">{row.medication}
                                <button
                                    className="bg-red-500 rounded m-2 px-2"
                                    onClick={() => handleOpenModal(row)}
                                >Medication Action</button>
                            </td>
                            <td className="border p-1">{row.time}</td>
                            <td className="border p-1">{row.initial}</td>
                            <td className="border p-1">{row.site}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && selectedRow && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="flex w-full max-w-4xl">
                        <div className="bg-white p-6 rounded shadow-md flex-grow rounded-tr-none rounded-br-none">
                            <h2 className="text-xl font-bold text-black mb-4 flex">
                                Medication Order Details
                            </h2>
                            <form>
                                {/* Read-only fields */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Start
                                    </label>
                                    <input
                                        type="text"
                                        name="start"
                                        value={selectedRow.start}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 text-black bg-gray-500 rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Stop
                                    </label>
                                    <input
                                        type="text"
                                        name="stop"
                                        value={selectedRow.stop}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 text-black bg-gray-500 rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Medication
                                    </label>
                                    <input
                                        type="text"
                                        name="medication"
                                        value={selectedRow.medication}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 text-black bg-gray-500 rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                {/* Editable fields */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Time
                                    </label>
                                    <input
                                        type="text"
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 text-black rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Initial
                                    </label>
                                    <input
                                        type="text"
                                        name="initial"
                                        value={formData.initial}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 text-black rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Site
                                    </label>
                                    <input
                                        type="text"
                                        name="site"
                                        value={formData.site}
                                        onChange={handleChange}
                                        className="mt-1 block w-full border border-gray-300 text-black rounded-md p-2 shadow-sm"
                                    />
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 mr-2"
                                        onClick={handleClickCancel}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={handleAdd}
                                    >
                                        Add
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Medication scan/verification */}
                        <div className="bg-white w-sm p-6 rounded shadow-md flex-grow rounded-tl-none rounded-bl-none">
                            <h2 className='text-black'>Scan Medication:</h2>
                            <input
                                type='text'
                                className='border text-black border-black rounded p-2'
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <br />
                            <br />
                            <br />
                            <textarea
                                value={textareaContent}
                                className={`border block w-full h-32 resize-none text-black border-black rounded p-2 ${getTextAreaColor(textareaContent)}`}
                                readOnly

                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export { MedicationInput, MedicationOutput };