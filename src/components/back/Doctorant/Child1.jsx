import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../../css/users.css';

function Child1() {
  const [doctorants, setDoctorants] = useState([]);
  const [UserInfos, setUserInfo] = useState([]);
  const [idUser, setIdUser] = useState('');
  const [error, setError] = useState(null);
  const [newUserData, setNewUserData] = useState({
    CIN: '',
    APOGEE: '',
    NOM: '',
    PRENOM: '',
    date_inscription: '',
    nationalite: 'Marocain',
    date_soutenance: '',
    sujet_these: '',
    user_id: '',
  });
  const [editUserData, setEditUserData] = useState(null);

  const nationalites = [
    "Marocain", "Algérien", "Tunisien", "Français", "Espagnol", "Italien",
    "Portugais", "Belge", "Suisse", "Américain", "Canadien", "Brésilien",
    "Argentin", "Mexicain", "Allemand", "Néerlandais", "Suédois", "Norvégien",
    "Danois", "Finlandais", "Autrichien", "Australien", "Néo-Zélandais",
    "Sud-Africain", "Chinois", "Japonais", "Coréen", "Indien", "Pakistanais",
    "Turc", "Égyptien", "Saoudien", "Emirati", "Qatari", "Libanais", "Syrien",
    "Jordanien", "Palestinien", "Irakien", "Koweïtien", "Yéménite", "Omanien",
    "Bahraini", "Iranien", "Afghan", "Bangladais", "Sri Lankais", "Malaisien",
    "Singapourien", "Indonésien", "Vietnamien", "Philippin", "Thaïlandais",
    "Russe", "Ukrainien", "Polonais", "Roumain", "Grec", "Tchèque", "Hongrois",
    "Bulgares", "Serbe", "Croate", "Slovène", "Slovaque", "Bosniaque", "Monténégrin",
    "Moldave", "Macédonien", "Albanais", "Arménien", "Géorgien", "Azerbaïdjanais"
  ]
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

  const fetchDoctorants = async (id = '') => {
    try {
      const response = await axios.get('/admin/professor/doctorants', { params: { prof_id: id } });
      setDoctorants(response.data.data);
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

  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const addUser = async () => {
    const { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, sujet_these, user_id } = newUserData;
    if (!CIN || !APOGEE || !NOM || !PRENOM || !date_inscription || !sujet_these || !user_id )
    {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('/admin/doctorants', { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, sujet_these, user_id });
      setNewUserData({
        CIN: '',
        APOGEE: '',
        NOM: '',
        PRENOM: '',
        date_inscription: '',
        nationalite: 'Marocain',
        date_soutenance: '',
        sujet_these: '',
        user_id: '',
      });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchDoctorants();
    } catch (error) {
      if (error.response && error.response.data.errorDate) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: error.response.data.errorDate,
        });
      } else {
        console.error('Error adding user:', error);
        setError('حدث خطأ أثناء الإضافة .');
      }
    }
  };
  const editUser = async () => {
    try {
      const { id, CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id } = editUserData;
      await axios.put(`/admin/doctorants/${id}`, { CIN, APOGEE, NOM, PRENOM, date_inscription, nationalite, date_soutenance, sujet_these, user_id });
      Swal.fire({
        title: "تم",
        text: "تم تحديث المعلومات بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
      fetchDoctorants();
    } catch (error) {
        if (error.response && error.response.data.errorDate) {
            Swal.fire({
              icon: 'error',
              title: 'خطأ',
              text: error.response.data.errorDate,
            });
          } else {
            console.error('Error updating user:', error);
            setError('حدث خطأ أثناء تحديث المعلومات .');
          }
    }
  };
  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "هل أنت متأكد؟",
        text: "لن تتمكن من التراجع عن هذا!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "نعم، احذفها!"
      });

      fetchDoctorants();

      if (result.isConfirmed) {
        await axios.delete(`/doctorants/${id}`);
        Swal.fire({
          title: "تم الحذف!",
          text: "تم الحذف بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('حدث خطأ أثناء الحذف .');
    }
  };
  const openEditModal = (user) => {
    setEditUserData(user);
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
        <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          <i className="fa fa-plus" aria-hidden="true" style={{ marginRight: '5px' }}></i>
          إضافة
        </button>
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
                <option value="">اختيار الأستاذ</option>
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
                  <th>إجراءات</th>
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
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(doctor.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(doctor)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                    </td>
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

      {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="CIN">البطاقة الوطنية </label>
                  <input type="text" className="form-control" id="CIN" name="CIN" value={newUserData.CIN} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="APOGEE">رقم أبوجي </label>
                  <input type="text" className="form-control" id="APOGEE" name="APOGEE" value={newUserData.APOGEE} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="NOM">النسب </label>
                  <input type="text" className="form-control" id="NOM" name="NOM" value={newUserData.NOM} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="PRENOM">الإسم </label>
                  <input type="text" className="form-control" id="PRENOM" name="PRENOM" value={newUserData.PRENOM} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_inscription">تاريخ التسجيل </label>
                  <input type="date" className="form-control" id="date_inscription" name="date_inscription" value={newUserData.date_inscription} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="nationalite">الجنسية </label>
                  <select
        className="form-control"
        id="nationalite"
        name="nationalite"
        value={newUserData.nationalite}
        onChange={handleNewDataChange}
      >
        {nationalites.map((nationalite, index) => (
          <option key={index} value={nationalite}>
            {nationalite}
          </option>
        ))}
      </select>
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_soutenance">تاريخ المناقشة </label>
                  <input type="date" className="form-control" id="date_soutenance" name="date_soutenance" value={newUserData.date_soutenance} onChange={handleNewDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="sujet_these">الموضوع </label>
                  <input type="text" className="form-control" id="sujet_these" name="sujet_these" value={newUserData.sujet_these} onChange={handleNewDataChange} />
                </div>
                <div className='form-group'>
                  <label htmlFor="user_id">الأستاذ</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={newUserData.user_id}
                    onChange={handleNewDataChange}
                    required
                  >
                    <option value="" disabled>اختر</option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editUserData && ( 
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel"> تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="CIN">البطاقة الوطنية </label>
                  <input type="text" className="form-control" id="CIN" name="CIN" value={editUserData.CIN} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="APOGEE">رقم أبوجي </label>
                  <input type="text" className="form-control" id="APOGEE" name="APOGEE" value={editUserData.APOGEE} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="NOM">النسب </label>
                  <input type="text" className="form-control" id="NOM" name="NOM" value={editUserData.NOM} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="PRENOM">الإسم </label>
                  <input type="text" className="form-control" id="PRENOM" name="PRENOM" value={editUserData.PRENOM} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_inscription">تاريخ التسجيل </label>
                  <input type="date" className="form-control" id="date_inscription" name="date_inscription" value={editUserData.date_inscription} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="nationalite">الجنسية </label>
                  <input type="text" className="form-control" id="nationalite" name="nationalite" value={editUserData.nationalite} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="date_soutenance">تاريخ المناقشة </label>
                  <input type="date" className="form-control" id="date_soutenance" name="date_soutenance" value={editUserData.date_soutenance} onChange={handleEditDataChange} />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="sujet_these">الموضوع </label>
                  <input type="text" className="form-control" id="sujet_these" name="sujet_these" value={editUserData.sujet_these} onChange={handleEditDataChange} />
                </div>

                <div className='form-group'>
                  <label htmlFor="user_id">صاحب المقال</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={editUserData.user_id}
                    onChange={handleEditDataChange}
                    required
                  >
                    <option value="" disabled>اختر صاحب المقال</option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">إلغاء</button>
          <button type="button" className="btn btn-primary" onClick={editUser}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Child1;
