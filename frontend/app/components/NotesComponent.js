import React from 'react';

const NotesComponent = ({ addNote, removeNote, notes }) => {
  const handleNoteChange = (noteText, index) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = { id: index + 1, text: noteText }; // Update the specific note
    addNote(updatedNotes); // Pass the updated notes array
  };

  return (
    <div className="bg-gray-500 h-screen w-full flex flex-col text-black">
      {Array.from({ length: 3 }).map((_, index) => (
        <textarea
          key={index}
          value={notes[index]?.text || ''}
          onChange={(e) => handleNoteChange(e.target.value, index)}
          placeholder={`Add note ${index + 1}`}
          className="resize-none rounded m-4 p-4 w-3/4 h-1/2"
        />
      ))}
    </div>
  );
};

export default NotesComponent;