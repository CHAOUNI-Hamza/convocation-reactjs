import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import '../../../css/users.css';

function Child3() {
  const [doctorants, setDoctorants] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [idUser, setIdUser] = useState('');
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        {/*const usersResponse = await axios.get('/laboratoires');
        setUserInfo(usersResponse.data.data); 
        fetchDoctorants();*/}
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchInitialData();
  }, []);

  const fetchDoctorants = async (id = '') => {
    try {
      if (id) {
        const response = await axios.get('/admin/professor/laboratoire', { params: { id_labo: id } });
        setDoctorants(response.data);
      } else {
        const response = await axios.get('/doctorants');
        setDoctorants(response.data.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching doctorants:', error);
      setError('حدث خطأ أثناء جلب البيانات.');
    }
  };
  
  

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
      'الأستاذ': `${user.user.nom} ${user.user.prénom}`,
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
            <h3 className="card-title font-arabic p-2" style={{ float: 'right', borderBottom: 'none',
    paddingBottom: '0' }}>لائحة الطلبة</h3>
    <div className="filter-group">
            <select
                className="form-select"
                style={{ width: '30%' }}
                value={idUser}
                onChange={handleSelectChange}
              >
                <option value="">اختيار المختبر</option>
                {UserInfos.map(prof => (
                  <option key={prof.id} value={prof.id}>{prof.nom} {prof.prénom}</option>
                ))}
              </select>
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
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
                  <th>الأستاذ</th>
                  <th>الموضوع</th>
                  <th className='text-center'>تاريخ المناقشة</th>
                  <th>تاريخ التسجيل</th>
                  <th>الجنسية</th>
                  <th>رقم أبوجي</th>
                  <th>البطاقة الوطنية</th>
                  <th>النسب</th>
                  <th>الإسم</th>
                </tr>
              </thead>
              <tbody>
                {doctorants.map(doctor => (
                  <tr key={doctor.id} style={{ textAlign: 'right' }}>
                    <td>{doctor.user.nom} {doctor.user.prénom}</td>
                    <td>{doctor.sujet_these}</td>
                    <td className='text-center'>{doctor.date_soutenance ? doctor.date_soutenance : '-'}</td>
                    <td>{doctor.date_inscription}</td>
                    <td>{doctor.nationalite}</td>
                    <td>{doctor.APOGEE}</td>
                    <td>{doctor.CIN}</td>
                    <td>{doctor.NOM}</td>
                    <td>{doctor.PRENOM}</td>
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
          {/*<div className="card-footer clearfix">
            <ul className="pagination pagination-sm m-0 float-right">
              {Array.from({ length: lastPage }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a className="page-link" href="#" onClick={() => handlePageChange(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>*/}
        </div>
      </div>

    </div>
  );
}

export default Child3;
