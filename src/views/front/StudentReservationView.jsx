import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/global.css';
import Swal from 'sweetalert2';
import coverHeader from '../../assets/cover-stu.jpg';
import logo from '../../assets/logo.jpg';

const StudentReservation = () => {
  const [apogee, setApogee] = useState('');
  const [studentres, setStudentRes] = useState(null);
  const [student, setStudent] = useState(null);

  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [message, setMessage] = useState('');
  const [reservations, setReservations] = useState([]);

  const printRef = useRef();

  const handlePrint = () => {
    window.print();
  };



  // Charger les créneaux disponibles au démarrage
  useEffect(() => {
    axios.get('/timeslots')
      .then(response => setTimeslots(response.data))
      .catch(error => console.error(error));
  }, []);

  const fetchReservations = () => {
    axios.get(`/reservations/${apogee}`)
      .then(response => {
        setStudentRes(response.data.studentres); // Nouveau : stocker les infos de l'étudiant
        setReservations(response.data.reservations);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des réservations', error);
      });
  };
  

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
        fetchReservations(); // Ajouter ici
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
      Swal.fire({
              icon: 'success',
              title: 'جيد',
              text: 'تم الحجز بنجاح',
            });
      setSelectedTimeslots([]);
      fetchReservations(); // Ajouter ici
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

{student && timeslots.length > 0 && (
  <div className='row  justify-content-around mt-5'>
  <div className='col-md-4' style={{ boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      padding: '37px' }}>
    {student && (
          <div className='font-arabic' style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <p><strong>Nom :</strong> {student.first_name}</p>
            <p><strong>Prénom :</strong> {student.last_name}</p>
            <p><strong>N° apogée : </strong> {student.apogee}</p>
            <p><strong>CNE :</strong> {student.cne}</p>
            <p><strong>CNI :</strong> {student.cnie}</p>
            <p><strong>Labo :</strong> {student.lab}</p>
          </div>
        )}
    </div>
  <div className='col-md-6' style={{ direction: 'rtl', boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
      padding: '37px' }}>
    {student && timeslots.length > 0 && (
          <form onSubmit={handleSubmit}>
            <h3 className='font-arabic'> حدد الفترات الزمنية</h3>
            <div className='row mt-4'>
              
                                  {timeslots.map(slot => (
                                    <div className='col-md-4'>
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
                                </div>
                                ))}
              
            </div>
            
  
            <button className="btn btn-primary font-arabic" type="submit" style={{ marginTop: '1rem' }}>إرسال الحجز</button>
          </form>
        )}
    </div>
    
  </div>
)}


{(studentres || (reservations && reservations.length > 0)) && (
  <>
    <button className="btn btn-primary mb-3 mt-5" onClick={handlePrint}>
      Imprimer
    </button>

    <div className='print mt-5' ref={printRef}>
    <img src={logo} alt="" width="20%" />
      <div className='info mt-5 mb-2'>
        {studentres && (
          <div className='row'>
            <div className='col-md-3'><span className="fw-bold">Nom :</span> {studentres.last_name}</div>
            <div className='col-md-3'><span className="fw-bold">Prénom :</span> {studentres.first_name}</div>
            <div className='col-md-3'><span className="fw-bold">Apogée :</span> {studentres.apogee}</div>
            <div className='col-md-3'><span className="fw-bold">CNI :</span> {studentres.cnie}</div>
          </div>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th style={{ width: "5%" }} scope="col"></th>
            <th style={{ width: "20%" }} scope="col">Date</th>
            <th style={{ width: "25%" }} scope="col">Créneau horaire</th>
            <th style={{ width: "50%" }} scope="col"></th>
          </tr>
        </thead>

        {reservations && reservations.length > 0 && (
          <tbody>
            {reservations.map((r, index) => (
              <tr key={index}>
                <th style={{ width: "5%" }} scope="row">{index + 1}</th>
                <td style={{ width: "20%" }}>{r.timeslot?.date}</td>
                <td style={{ width: "25%" }}>{r.timeslot?.time_range}</td>
                <td style={{ width: "50%" }}></td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      <div className='text-red mb-5'>الطالب مدعو للحراسة في امتحانات الدورة العادية الربيعية بالكلية، وليس له الحق في اختيار الأستاذ (ة) أو القاعة</div>
    </div>
  </>
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
