import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentReservation = () => {
  const [apogee, setApogee] = useState('');
  const [student, setStudent] = useState(null);
  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [message, setMessage] = useState('');

  // Charger les créneaux disponibles au démarrage
  useEffect(() => {
    axios.get('/timeslots')
      .then(response => setTimeslots(response.data))
      .catch(error => console.error(error));
  }, []);

  // Gérer l'entrée APOGEE
  const handleApogeeChange = (e) => {
    setApogee(e.target.value);
  };

  // Chercher étudiant par APOGEE
  const fetchStudent = () => {
    if (!apogee) return;

    axios.get(`/students/${apogee}`)
      .then(response => {
        setStudent(response.data);
        setMessage('');
      })
      .catch(() => {
        setStudent(null);
        setMessage('Student not found');
      });
  };

  // Gérer sélection de créneaux
  const handleTimeslotChange = (id) => {
    setSelectedTimeslots(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  // Envoi des réservations
  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('/reservations', {
      apogee,
      timeslots: selectedTimeslots
    }).then(() => {
      setMessage('Reservation successful!');
      setSelectedTimeslots([]);
    }).catch(() => {
      setMessage('Error saving reservation.');
    });
  };

  return (
    <div className="student-reservation" style={{ maxWidth: '500px', margin: 'auto' }}>
      <h2>Student Reservation</h2>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter APOGEE number"
          value={apogee}
          onChange={handleApogeeChange}
        />
        <button onClick={fetchStudent}>Search</button>
      </div>

      {student && (
        <div style={{ marginBottom: '1rem' }}>
          <p><strong>First Name:</strong> {student.first_name}</p>
          <p><strong>Arabic Last Name:</strong> {student.last_name_ar}</p>
        </div>
      )}

      {student && timeslots.length > 0 && (
        <form onSubmit={handleSubmit}>
          <h3>Select Timeslots:</h3>
          {timeslots.map(slot => (
            <div key={slot.id}>
              <label>
                <input
                  type="checkbox"
                  value={slot.id}
                  checked={selectedTimeslots.includes(slot.id)}
                  onChange={() => handleTimeslotChange(slot.id)}
                />
                {slot.date} – {slot.time_range}
              </label>
            </div>
          ))}

          <button type="submit" style={{ marginTop: '1rem' }}>Submit Reservation</button>
        </form>
      )}

      {message && (
        <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default StudentReservation;
