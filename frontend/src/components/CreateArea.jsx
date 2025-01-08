import React, { useState, useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import Zoom from '@mui/material/Zoom';
import axios from 'axios'; // Make sure axios is imported for HTTP requests

function CreateArea(props) {
  const [isExpanded, setExpanded] = useState(false);
  const imageInputRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(true);
  const [note, setNote] = useState({
    title: "",
    content: "",
    date: "",
    time: "",
    venue: "",
    image: ""
  });
  const [errors, setErrors] = useState({}); // State to hold error messages

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setNote(prevNote => ({
      ...prevNote,
      image: imageURL
    }));
  }

  function validateFields() {
    const newErrors = {};
    if (!note.title) newErrors.title = "Event title is required.";
    if (!note.date) newErrors.date = "Date is required.";
    if (!note.time) newErrors.time = "Time is required.";
    if (!note.venue) newErrors.venue = "Venue is required.";
    return newErrors;
  }

  async function submitNote(event) {
    event.preventDefault();

    const validationErrors = validateFields();
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    try {
      const response = await axios.post('http://localhost:5000/api/events', note);
      props.onAdd(response.data); // Add the note to the list after receiving the response
      setNote({
        title: "",
        content: "",
        date: "",
        time: "",
        venue: "",
        image: ""
      });
      setFormVisible(false); // Hide the form after submission
      if (imageInputRef.current) {
        imageInputRef.current.value = ""; // Reset the file input
      }
    } catch (error) {
      console.error("Error submitting note:", error);
    }
  }

  function expand() {
    setExpanded(true);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: "1" }}>
        {isFormVisible ? (
          <form className="create-note" onSubmit={submitNote}> {/* Form submit handler */}
            {isExpanded && (
              <>
                <input
                  name="title"
                  onChange={handleChange}
                  value={note.title}
                  placeholder="Event"
                  required
                />
                {errors.title && <p style={{ color: 'red' }}>{errors.title}</p>}
                
                <input
                  type="date"
                  name="date"
                  onChange={handleChange}
                  value={note.date}
                  placeholder="Date"
                  required
                />
                {errors.date && <p style={{ color: 'red' }}>{errors.date}</p>}
                
                <input
                  type="time"
                  name="time"
                  onChange={handleChange}
                  value={note.time}
                  placeholder="Time"
                  required
                />
                {errors.time && <p style={{ color: 'red' }}>{errors.time}</p>}
                
                <input
                  name="venue"
                  onChange={handleChange}
                  value={note.venue}
                  placeholder="Venue"
                  required
                />
                {errors.venue && <p style={{ color: 'red' }}>{errors.venue}</p>}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={imageInputRef}
                />
                {note.image && (
                  <img
                    src={note.image}
                    alt="Preview"
                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                  />
                )}
              </>
            )}

            <textarea
              name="content"
              onClick={expand}
              onChange={handleChange}
              value={note.content}
              placeholder={isExpanded ? "Description" : "Event"}
              rows={isExpanded ? 3 : 1}
            />
            <Zoom in={isExpanded}>
              <Fab type="submit"> {/* Updated submit button */}
                <AddIcon />
              </Fab>
            </Zoom>
          </form>
        ) : (
          <div>
            <button className="add-note-button" onClick={() => setFormVisible(true)}>
              Add another note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreateArea;
