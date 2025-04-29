import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import coverHeader from '../../assets/cover-stu.jpg';

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

const StudentReservation = () => {
  const [apogee, setApogee] = useState('');
  const [studentres, setStudentRes] = useState(null);
  const [student, setStudent] = useState(null);

  const [timeslots, setTimeslots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [message, setMessage] = useState('');
  const [reservations, setReservations] = useState([]);



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

  const generatePDF = async () => {
    console.log("Réservations reçues :", reservations);
    console.log("Informations étudiant reçues :", studentres);
  
    // 1. Charger le modèle PDF
    const existingPdfBytes = await fetch('/reservation.pdf').then(res => res.arrayBuffer());
  
    // 2. Charger le PDF existant
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
  
    // 3. Embedding font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
    // 4. Sélection de la première page
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    let { height } = firstPage.getSize();
  
    // 5. Ajouter chaque champ séparément (sans label)
    firstPage.drawText(studentres.first_name, { x: 230, y: 761, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(studentres.last_name, { x: 100, y: height - 140, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(studentres.apogee, { x: 100, y: height - 160, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(studentres.cne, { x: 100, y: height - 180, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(studentres.cnie, { x: 100, y: height - 200, size: 12, font, color: rgb(0, 0, 0) });
    firstPage.drawText(studentres.lab, { x: 100, y: height - 240, size: 12, font, color: rgb(0, 0, 0) });

  
    // 6. Ajouter les réservations
    let y = height - 280; // Reprendre plus bas après les infos étudiant
    reservations.forEach((res, index) => {
      const date = res.timeslot.date;
      const time = res.timeslot.time_range;
  
      firstPage.drawText(`${index + 1}. ${date}`, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
  
      firstPage.drawText(`${time}`, {
        x: 200,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
      });
  
      y -= 20;
    });
  
    // 7. Sauvegarde et téléchargement
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reservations.pdf';
    a.click();
    URL.revokeObjectURL(url);
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

<div className='row  justify-content-around mt-5'>
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
  <div className='col-md-4' style={{ boxShadow: '0 10px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
    padding: '37px' }}>
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
{reservations.length > 0 && (
  <div className="font-arabic mt-4" style={{ textAlign: 'right', direction: 'rtl' }}>
    <h4>الحجوزات السابقة</h4>
    <ul>
      {reservations.map(r => (
        <li key={r.id}>
          {r.timeslot?.date} - {r.timeslot?.time_range}
        </li>
      ))}
    </ul>
    <button onClick={generatePDF}>Télécharger PDF</button>
  </div>
)}

{studentres && (
  <div>
    <h5>Informations de l’étudiant</h5>
    <p>Nom : {studentres.first_name}</p>
    <p>Prénom : {studentres.last_name}</p>
    <p>Apogée : {studentres.apogee}</p>
  </div>
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
