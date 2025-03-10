import React, { useEffect } from 'react';

const NotesComponent = ({ addNote, removeNote, notes }) => {
  const handleNoteChange = (noteText, index) => {
    const newNote = {
      id: index + 1,
      text: noteText,
    };
    addNote(newNote);
  };

  useEffect(() => {
    notes.forEach((note, index) => {
      handleNoteChange(note.text, index);
    });
  }, []);

  return (
    <div className="bg-gray-500 h-screen w-full flex flex-col">
      <div className="mb-4">
        <textarea
          value={notes[0]?.text || ''}
          onChange={(e) => handleNoteChange(e.target.value, 0)}
          placeholder="Add a note"
          className="resize-none rounded m-4 p-4 w-3/4 h-1/2"
        />
        <textarea
          value={notes[1]?.text || ''}
          onChange={(e) => handleNoteChange(e.target.value, 1)}
          placeholder="Add a note"
          className="resize-none rounded m-4 p-4 w-3/4 h-1/2"
        />
        <textarea
          value={notes[2]?.text || ''}
          onChange={(e) => handleNoteChange(e.target.value, 2)}
          placeholder="Add a note"
          className="resize-none rounded m-4 p-4 w-3/4 h-1/2"
        />
      </div>
    </div>
  );
};

export default NotesComponent;