import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Note(props) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedNote, setUpdatedNote] = useState({
    title: props.title || "",
    content: props.content || "",
    date: props.date || "",
    time: props.time || "",
    venue: props.venue || "",
    image: props.image || ""
  });

  function handleClickDelete() {
    props.onDelete(props.id);
  }

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleUpdateChange(event) {
    const { name, value } = event.target;
    setUpdatedNote(prevNote => ({
      ...prevNote,
      [name]: value
    }));
  }

  function handleImageUpdate(event) {
    const file = event.target.files[0];
    const imageURL = URL.createObjectURL(file);
    setUpdatedNote(prevNote => ({
      ...prevNote,
      image: imageURL
    }));
  }

  function handleUpdateSubmit(event) {
    event.preventDefault();
    props.onUpdate(props.id, updatedNote);
    setIsEditing(false); // Set editing mode to false after updating
  }

  function handleBack() {
    setIsEditing(false);
    setUpdatedNote({
      title: props.title,
      content: props.content,
      date: props.date,
      time: props.time,
      venue: props.venue,
      image: props.image
    });
  }

  return (
    <div className="note">
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
          <input name="title" onChange={handleUpdateChange} value={updatedNote.title} placeholder="Event Title" required />
          <textarea name="content" onChange={handleUpdateChange} value={updatedNote.content} placeholder="Description" rows="3" required />
          <input type="date" name="date" onChange={handleUpdateChange} value={updatedNote.date} required />
          <input type="time" name="time" onChange={handleUpdateChange} value={updatedNote.time} required />
          <input name="venue" onChange={handleUpdateChange} value={updatedNote.venue} placeholder="Venue" required />
          <input type="file" accept="image/*" onChange={handleImageUpdate} />
          {updatedNote.image && (
            <img src={updatedNote.image} alt="event" style={{ width: "100px", height: "100px", marginTop: "10px" }} />
          )}
          <button type="submit">
            <SaveAltIcon />
          </button>
          <button type="button" onClick={handleBack}>
            <ArrowBackIcon />
          </button>
        </form>
      ) : (
        <div>
          <h1>{props.title}</h1>
          <p>{props.content}</p>
          <p>Date: {props.date}</p>
          <p>Time: {props.time}</p>
          <p>Venue: {props.venue}</p>
          {props.image && (
            <img src={props.image} alt="event" style={{ width: "100px", height: "100px", marginTop: "10px" }} />
          )}
          <button onClick={handleEditClick}>
            <EditIcon />
          </button>
          <button onClick={handleClickDelete}>
            <DeleteIcon />
          </button>
        </div>
      )}
    </div>
  );
}

export default Note;
