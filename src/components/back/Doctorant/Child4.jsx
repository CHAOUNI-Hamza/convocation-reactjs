import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../../../css/users.css';

function Child4() {
  const [doctorants, setDoctorants] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [idUser, setIdUser] = useState('');
  const [error, setError] = useState(null);

  const fetchDoctorants = async (id = '') => {
    try {
      const response = await axios.get('/admin/professor/statistique', { params: { user_id: id } });
      console.log(response.data);
      setDoctorants(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching doctorants:', error);
      setError('حدث خطأ أثناء جلب البيانات.');
    }
  };

  useEffect(() => {
    fetchDoctorants();
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const usersResponse = await axios.get('/users');
        setUserInfo(usersResponse.data.data);
        fetchDoctorants();
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const handleSelectChange = (event) => {
    setIdUser(event.target.value);
    fetchDoctorants(event.target.value);
  };

  const clearFilters = () => {
    setIdUser('');
    fetchDoctorants();
  };

  const convertToExcel = (data) => {
    const ws = XLSX.utils.json_to_sheet(data.map(user => ({
      'الإسم و النسب': `${user.NOM} ${user.PRENOM}`,
      'البطاقة الوطنية': user.CIN,
      'رقم أبوجي': user.APOGEE,
      'الجنسية': user.nationalite,
      'تاريخ التسجيل': user.date_inscription,
      'تاريخ المناقشة': user.date_soutenance,
      'الموضوع': user.sujet_these,
      'الأستاذ': `${user.nom} ${user.prénom}`,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Doctorants');
    return wb;
  };

  const downloadExcel = () => {
    const wb = convertToExcel(doctorants);
    XLSX.writeFile(wb, 'users.xlsx');
  };

  return (
    <div className="row font-arabic">
      <div className="col-12">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title font-arabic p-2" style={{ float: 'right', borderBottom: 'none', paddingBottom: '0' }}>
              لائحة الطلبة
            </h3>
            <div className="filter-group">
            <select
                className="form-select"
                style={{ width: '30%' }}
                value={idUser}
                onChange={handleSelectChange}
              >
                <option value="">اختيار الأستاذ</option>
                {UserInfos.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.nom} {prof.prénom}</option>
                ))}
              </select>
              <button type="button" className="btn btn-secondary btn-sm" onClick={clearFilters}>
                افرغ
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={downloadExcel}
                aria-label="تحميل"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" style={{ marginRight: '5px' }} height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z"/>
                </svg>
                تحميل
              </button>
            </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  
                  
                  <th>عدد الطلبة</th>
                  
                  <th>المختبر</th>
                  <th>الأستاذ</th>
                </tr>
              </thead>
              <tbody>
                {doctorants.map(doctor => (
                  <tr key={doctor.id} style={{ textAlign: 'right' }}>
                    
                    <td>{doctor.doctorants_count}</td>
                    
                    <td>{doctor.laboratoire?.nom}</td>
                    <td>{doctor.nom} {doctor.prénom}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Child4;
