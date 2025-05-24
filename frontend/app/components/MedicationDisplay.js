import React, { useState, useEffect } from 'react';

// Medication Input is for instructors to create a medication list for a patient.
// Medication Output is to be used for scenarios.
// The main difference between them is that Medication Input has a button to add a new row and a button to remove a row.

const MedicationInput = ({ rows = [], addRow, removeRow }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalError, setModalError] = useState("");
    const [newRow, setNewRow] = useState({
        ndc: "",
        start_times: [""],
        stop: "",
        medication: "",
        dose: "",
        time: "",
        initial: "",
        site: "",
        status: "Active",
        frequency: "",
        prn: false,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "ndc") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setNewRow((prev) => ({ ...prev, [name]: numericValue }));
        } else if (name === "start_times") {
            // Skip handling "start" here since it's managed separately in the start times component
        } else if (name === "stop") {
            if (value === "" || (Number(value) >= 0 && Number(value) <= 2359)) {
                setNewRow((prev) => ({ ...prev, [name]: value }));
            }
        } else {
            setNewRow((prev) => ({ ...prev, [name]: value }));
        }
    };

    const resetNewRow = () => {
        setNewRow({
            ndc: "",
            start_times: [""],
            stop: "",
            medication: "",
            dose: "",
            time: "",
            initial: "",
            site: "",
            status: "Active",
            frequency: "",
            prn: false,
        });
        setModalError("")
        setIsModalOpen(false);
    }

    const handleOpenModal = () => {
        resetNewRow();
        setIsModalOpen(true);
    };


    const handleAddRow = () => {
        setModalError("");
        const hasValidStartTime = newRow.start_times.some(time => time.trim() !== "");

        if (!newRow.ndc || !hasValidStartTime || !newRow.dose || !newRow.medication || !newRow.frequency) {
            setModalError("All fields except stop time are required.")
        } else {
            const rowToAdd = {
                ...newRow,
                stop: newRow.stop === "" ? null : newRow.stop,
                time: newRow.time === "" ? null : newRow.time,
            };
            addRow(rowToAdd);
            resetNewRow();
        }
    };

    useEffect(() => {
        document.body.style.overflow = isModalOpen ? "hidden" : "auto";
    }, [isModalOpen]);

    return (
        <div className="relative inline-block">
            <table className="bg-gray-500 w-full h-fit border-collapse table-fixed border-spacing-3">
                <thead>
                    <tr>
                        <th className="border w-3/12">Medication ID (Barcode)</th>
                        <th className="border w-1/12">Status</th>
                        <th className="border w-1/12">Start</th>
                        <th className="border w-1/12">Stop</th>
                        <th className="border w-4/12">Medication</th>
                        <th className="border w-1/12">Dose</th>
                        <th className="border w-1/12">Frequency</th>
                        <th className="border w-1/12">PRN</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr key={row.id || `row-${index}`}>
                            <td className="border pl-2">{row.ndc}</td>
                            <td className="border pl-2">{row.status}</td>
                            <td className="border pl-2">{row.start_times.join(', ')}</td>
                            <td className="border pl-2">{row.stop}</td>
                            <td className="border pl-2">
                                <div className="flex w-full justify-between items-center">
                                    <span>{row.medication}</span>
                                    <button
                                        className="bg-red-500 rounded m-2 px-2 text-white hover:bg-red-600"
                                        onClick={() => removeRow(row.id)}
                                    >Delete</button>
                                </div>
                            </td>
                            <td className="border pl-2">{row.dose}</td>
                            <td className="border pl-2">{row.frequency}</td>
                            <td className="border pl-2">{row.prn ? "✓" : "X"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button
                className="rounded bg-green-500 p-2 m-2 text-white hover:bg-green-600"
                onClick={() => handleOpenModal()}
            > Add Medication</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-md w-180">
                        <h2 className="text-xl font-bold text-black mb-4">Add Medication</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-gray-700">Medication ID (Barcode)</label>
                                <input
                                    type="text"
                                    name="ndc"
                                    step="1"
                                    value={newRow.ndc}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded text-black"
                                    placeholder="Medication ID"
                                    inputMode="numeric"
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
                            <div className="mb-4">
                                <label className="block text-gray-700">Start Times</label>
                                <div className="space-y-2">
                                    {newRow.start_times.map((startTime, index) => (
                                        <div key={index} className="flex items-center space-x-2">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                min="0000"
                                                max="2359"
                                                value={startTime}
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/[^0-9]/g, '');
                                                    const updatedStartTimes = [...newRow.start_times];
                                                    updatedStartTimes[index] = value;
                                                    setNewRow((prev) => ({ ...prev, start_times: updatedStartTimes }));
                                                }}
                                                className="w-full px-3 py-2 border rounded text-black"
                                                placeholder="0000 - 2359"
                                            />
                                            <button
                                                type="button"
                                                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                onClick={() => {
                                                    const updatedStartTimes = newRow.start_times.filter((_, i) => i !== index);
                                                    setNewRow((prev) => ({ ...prev, start_times: updatedStartTimes }));
                                                }}
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    onClick={() => {
                                        setNewRow((prev) => ({ ...prev, start_times: [...prev.start_times, ""] }));
                                    }}
                                >
                                    Add Start Time
                                </button>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Stop Time (Optional)</label>
                                <input
                                    type="number"
                                    min="0000"
                                    max="2359"
                                    name="stop_time"
                                    value={newRow.stop_time || ""}
                                    onChange={(e) => setNewRow((prev) => ({ ...prev, stop_time: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded text-black"
                                    placeholder="0000 - 2359"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700">Dose</label>
                                <input
                                    type="text"
                                    name="dose"
                                    value={newRow.dose}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded text-black"
                                    placeholder="e.g. 500mg"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700">Frequency</label>
                                <input
                                    type="text"
                                    name="frequency"
                                    value={newRow.frequency}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded text-black"
                                    placeholder="e.g. QD, BID, TID"
                                />
                            </div>
                            <div className="mb-4 col-span-2">
                                <label className="block text-gray-700">PRN</label>
                                <input
                                    type="checkbox"
                                    name="prn"
                                    checked={newRow.prn}
                                    onChange={(e) => setNewRow((prev) => ({ ...prev, prn: e.target.checked }))}
                                    className="ml-2"
                                />
                            </div>
                            <div className="mb-4 col-span-2">
                                <label className="block text-gray-700">Status</label>
                                <select
                                    name="status"
                                    value={newRow.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded text-black"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Discontinued">Discontinued</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="flex w-full justify-center text-red-500">
                                {modalError}
                            </div>
                            <button
                                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 mr-2"
                                onClick={() => resetNewRow()}
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
        } else if (selectedRow && parseInt(value) === selectedRow.ndc) {
            setTextareaContent('Matched content');
            setIsNdcMatched(true);
        } else {
            setTextareaContent('Not matched content');
            setIsNdcMatched(false);
        }
    };

    const handleAdd = () => {
        if (selectedRow && isNdcMatched) {
            const updatedRows = rows.map((row, idx) =>
                idx === selectedRow.idx ? { ...row, ...formData } : row
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

    const handleOpenModal = (row, idx) => {
        setSelectedRow({ ...row, idx });
        console.log(row);
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
                    <tr key = {rows.id}>
                        <th className="border w-1/12">Status</th>
                        <th className="border w-1/12">Start</th>
                        <th className="border w-1/12">Stop</th>
                        <th className="border w-4/12">Medication</th>
                        <th className="border w-1/12">Dose</th>
                        <th className="border w-1/12">Frequency</th>
                        <th className="border w-1/12">PRN</th>
                        <th className="border w-1/12">Time</th>
                        <th className="border w-1/12">Initial</th>
                        <th className="border w-1/12">Site</th>
                    </tr>
                </thead>
                <tbody>

                    {rows.map((row, index) => (
                        <tr key={row.id || `row-${index}`}>
                            <td className="border pl-2 text-sm">{row.status}</td>
                            <td className="border pl-2">{row.start_times.join(', ')}</td>
                            <td className="border pl-2">{row.stop}</td>
                            <td className="border pl-2">
                                <div className="flex w-full justify-between items-center">
                                    <span>{row.medication}</span>
                                    <button
                                        className="bg-red-500 rounded m-2 px-2"
                                        onClick={() => handleOpenModal(row, index)}
                                    >Medication Action</button>
                                </div>
                            </td>
                            <td className="border pl-2">{row.dose}</td>
                            <td className="border pl-2">{row.frequency}</td>
                            <td className="border pl-2">{row.prn ? "✓" : ""}</td>
                            <td className="border pl-2">{row.time}</td>
                            <td className="border pl-2">{row.initial}</td>
                            <td className="border pl-2">{row.site}</td>
                        </tr>
                        //
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
                                        value={selectedRow.start_times}
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