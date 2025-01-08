import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import Search from "./Search";

function App() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [notification, setNotification] = useState(""); // State for notification message
  const [mapLocation, setMapLocation] = useState(null); // State for storing the map location

  useEffect(() => {
    axios.get("http://localhost:5000/api/events")
      .then((response) => {
        setNotes(response.data);
        setFilteredNotes(response.data); // Initialize filtered notes
      })
      .catch((error) => console.error(error));
  }, []);

  // Function to initialize and update Google Map
  function loadGoogleMap(location) {
    const mapScript = document.createElement('script');
    mapScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqzGYxZDTRhnYtjZBxRJpFAWHIGh9xcY4&callback=initMap`;
    window.initMap = function () {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ 'address': location }, function (results, status) {
        if (status === 'OK') {
          const map = new window.google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: results[0].geometry.location
          });
          new window.google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };
    document.head.appendChild(mapScript);
  }

  function addNote(newNote) {
    axios.post("http://localhost:5000/api/events", newNote)
      .then((response) => {
        setNotes(prevNotes => {
          const updatedNotes = [...prevNotes, response.data]; // Use response data
          setNotes(updatedNotes);
          setFilteredNotes(updatedNotes);
          return updatedNotes;
        });
      })
      .catch((error) => console.error(error));
  }

  function deleteNote(id) {
    axios.delete(`http://localhost:5000/api/events/${id}`)
      .then(() => {
        setNotes(prevNotes => {
          const updatedNotes = prevNotes.filter(noteItem => noteItem._id !== id); // Use _id
          setNotes(updatedNotes);
          setFilteredNotes(updatedNotes);
          return updatedNotes;
        });
      })
      .catch((error) => console.error(error));
  }

  function updateNote(id, updatedNote) {
    axios.put(`http://localhost:5000/api/events/${id}`, updatedNote)
      .then((response) => {
        setNotes(prevNotes => {
          const updatedNotes = prevNotes.map(noteItem =>
            noteItem._id === id ? response.data : noteItem); // Use response data
          setNotes(updatedNotes);
          setFilteredNotes(updatedNotes);
          return updatedNotes;
        });
      })
      .catch((error) => console.error(error));
  }

  function handleSearch(searchTerm) {
    setNotification(""); // Clear any existing notifications immediately
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.date.includes(searchTerm)
    );
  
    setFilteredNotes(filtered);
    
    // Set the map location to the searched venue or event
    if (filtered.length > 0) {
      const location = filtered[0].venue; // Use the first matched venue
      setMapLocation(location); // Set the location for the map
      loadGoogleMap(location);  // Load Google Map for this location
      setNotification(`Showing results for "${searchTerm}"`); // Set notification message
    } else {
      setNotification(`No results found for "${searchTerm}"`); // Set notification for no results
    }

    // Clear notification after a delay
    setTimeout(() => {
      setNotification("");
    }, 3000);
  }

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        <Header />
        {notification && <div className="notification">{notification}</div>} {/* Notification message */}
        <Search onSearch={handleSearch} />
        <CreateArea onAdd={addNote} />
        {filteredNotes.map((noteItem) => (
          <Note
            key={noteItem._id} // Use unique id here
            id={noteItem._id} // Ensure id is passed correctly
            title={noteItem.title}
            content={noteItem.content}
            date={noteItem.date}
            time={noteItem.time}
            venue={noteItem.venue}
            image={noteItem.image}
            onDelete={deleteNote}
            onUpdate={updateNote}
          />
        ))}
      </div>
      {mapLocation && (
        <div style={{ width: "400px", marginLeft: "20px" }}>
          <h3>Venue Location:</h3>
          <div id="map" style={{ width: '100%', height: '400px' }} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
