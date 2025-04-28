import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import coverHeader from '../../assets/cover-stu.jpg';

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

    console.log('Apogee:', apogee);
    console.log('Selected Timeslots:', selectedTimeslots);

    axios.post('/reservations', {
      apogee,
      timeslots: selectedTimeslots
    }).then(() => {
      Swal.fire({
              icon: 'success',
              title: 'جيد',
              text: 'تم الحجز بنجاح',
            });
      setSelectedTimeslots([]);
    }).catch((error) => {
      if (error.response && error.response.data && error.response.data.message) {
        Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: error.response.data.message,
              });
      } else {
        Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: "خطأ أثناء تسجيل الحجز",
              });
      }
    });
  };

  return (
    <div className="student-reservation mt-5 container text-center">
      <img src={coverHeader} alt="" width="100%" />
      <h3 className='font-arabic mt-5'>الرجاء إدخال رقم أبو جي الخاص بك</h3>

      <div className="mb-3">
  <input
    type="text"
    className="form-control mt-4"
    style={{direction: 'rtl'}}
    placeholder="الرجاء إدخال رقم أبو جي الخاص بك"
    value={apogee}
    onChange={handleApogeeChange}
  />
</div>
<div>
  <button onClick={fetchStudent} className="btn btn-primary font-arabic">البحث</button>
</div>

<div className='row mt-5'>
<div className='col-md-6' style={{ direction: 'rtl' }}>
  {student && timeslots.length > 0 && (
        <form onSubmit={handleSubmit}>
          <h3 className='font-arabic'> حدد الفترات الزمنية</h3>
          {timeslots.map(slot => (
            <div key={slot.id}>
              <label style={{ fontFamily: 'Cairo' }}>
                <input
                style={{ marginLeft: '10px' }}
                  type="checkbox"
                  value={slot.id}
                  checked={selectedTimeslots.includes(slot.id)}
                  onChange={() => handleTimeslotChange(slot.id)}
                />
                {slot.date} – {slot.time_range}
              </label>
            </div>
          ))}

          <button className="btn btn-primary font-arabic" type="submit" style={{ marginTop: '1rem' }}>إرسال الحجز</button>
        </form>
      )}
  </div>
  <div className='col-md-6'>
  {student && (
        <div className='font-arabic' style={{ marginBottom: '1rem', direction: 'rtl', textAlign: 'right' }}>
          <p><strong>الأبوجي :</strong> {student.apogee}</p>
          <p><strong>رقم الطالب :</strong> {student.cne}</p>
          <p><strong>الإسم :</strong> {student.first_name_ar}</p>
          <p><strong>النسب :</strong> {student.last_name_ar}</p>
          <p><strong>رقم البطاقة الوطنية :</strong> {student.cnie}</p>
          <p><strong>المختبر :</strong> {student.lab}</p>
        </div>
      )}
  </div>
  
</div>
      

      

      {message && (
        <p style={{ color: message.includes('success') ? 'green' : 'red', marginTop: '1rem' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default StudentReservation;
