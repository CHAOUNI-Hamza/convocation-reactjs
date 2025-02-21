import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { UserContext } from '../../../UserContext';
import PropTypes from 'prop-types';

function Users({ onUserClick, onUserArtClick }) {
    const { userInfo } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState('profil');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedUserIdArt, setSelectedUserIdArt] = useState(null);
    const [users, setUsersEquipe] = useState([]);
    const [LaboInfos, setLaboInfo] = useState([]);
    const [EquipesInfos, setEquipeInfo] = useState([]);
    const [editUserData, setEditUserData] = useState(null);
    const [newUserData, setNewUserData] = useState({
      nom: '',
      prénom: '',
      role: 0,
      email: '',
      password: '',
      confirmPassword: '',
      laboratoire_id: '',
      equipe_id: userInfo?.equipe_id || ''
    });

    const fetchData = async () => {
      if(userInfo && userInfo.equipe_id) {
        // Recuperer tous les users d'une equipe specifique
        {/*axios.get(`/equipes/${userInfo.equipe_id}/users`)
          .then(response => {
            setUsersEquipe(response.data.data);
          })
          .catch(error => {
            console.error('There was an error fetching users equipe!', error);
          });*/}
    }
    };
    const fetchLaboAndEquipesData = async () => {
      try {
        {/*const laboResponse = await axios.get('/laboratoires');
        setLaboInfo(laboResponse.data.data);
        const equipeResponse = await axios.get('/equipes');
        setEquipeInfo(equipeResponse.data.data);*/}
      } catch (error) {
        console.error('Error fetching labo or equipe data!', error);
      }
    };

    useEffect(() => {
      
  
      fetchLaboAndEquipesData();
      fetchData();
    }, [userInfo]);

    const handleEditUserDataChange = (e) => {
      const { name, value } = e.target;
      setEditUserData({ ...editUserData, [name]: value });
    };
    
    const addUser = async () => {
      const { nom, prénom, role, email, password, confirmPassword, laboratoire_id, equipe_id } = newUserData;
      /*if (!nom || !prénom || !role || !email || !password || !confirmPassword || !laboratoire_id || !equipe_id ) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'يرجى ملء جميع الحقول المطلوبة!',
        });
        return;
      }*/
      if (password !== confirmPassword) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'كلمة المرور وتأكيد كلمة المرور غير متطابقين!',
        });
        return;
      }
      try {
        await axios.post('/users', { nom, prénom, role, email, password, laboratoire_id, equipe_id });
        fetchData();
        setNewUserData({
          nom: '',
          prénom: '',
          role: 0,
          email: '',
          password: '',
          confirmPassword: '',
          laboratoire_id: '',
          equipe_id: userInfo?.equipe_id || ''
        });
        Swal.fire({
          title: "تم",
          text: "تمت إضافة مستخدم جديد بنجاح.",
          icon: "success"
        }).then(() => {
          document.getElementById('closeModalBtn').click();
        });
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };
    const handleNewUserDataChange = (e) => {
      const { name, value } = e.target;
      setNewUserData({ ...newUserData, [name]: value });
    };
    const editPassword = async () => {
      const { id, newPassword, confirmNewPassword } = editPasswordData;
      if (!newPassword || !confirmNewPassword) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'يرجى إدخال كلمة مرور جديدة وتأكيد كلمة المرور!',
        });
        return;
      }
      if (newPassword !== confirmNewPassword) {
        Swal.fire({
          icon: 'error',
          title: 'خطأ',
          text: 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين!',
        });
        return;
      }
      try {
        await axios.put(`/users/${id}/password`, { newPassword: newPassword });
        fetchData();
        Swal.fire({
          title: "تم",
          text: "تم تحديث كلمة المرور بنجاح.",
          icon: "success"
        }).then(() => {
          document.getElementById('closePasswordModalBtn').click();
        });
      } catch (error) {
        console.error('Error updating password:', error);
      }
    };
    const editUser = async () => {
      try {
        const { id, nom, prénom, role, email, laboratoire_id, equipe_id } = editUserData;
        await axios.put(`/users/${id}`, { nom, prénom, role, email, laboratoire_id, equipe_id });
        fetchData();
        Swal.fire({
          title: "تم",
          text: "تم تحديث معلومات المستخدم بنجاح.",
          icon: "success"
        }).then(() => {
          document.getElementById('closeEditModalBtn').click();
        });
      } catch (error) {
        console.error('Error updating user:', error);
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
  
        if (result.isConfirmed) {
          await axios.delete(`/users/${id}`);
          fetchData();
          Swal.fire({
            title: "تم الحذف!",
            text: "تم حذف المستخدم بنجاح.",
            icon: "success"
          });
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    };
    const getRoleLabel = (role) => {
      switch(role) {
        case 0: return { label: "Professeur", color: "green" };
        case 1: return { label: "Chef d'equipe", color: "orange" };
        case 2: return { label: "Chef Laboratoire", color: "blue" };
        case 3: return { label: "Admin", color: "red" };
        default: return { label: "Unknown", color: "black" };
      }
    };
    const handleEditPasswordDataChange = (e) => {
      const { name, value } = e.target;
      setEditPasswordData({ ...editPasswordData, [name]: value });
    };
    
    const [editPasswordData, setEditPasswordData] = useState({
      id: null,
      newPassword: '',
      confirmNewPassword: ''
    });
  
    const openEditModal = (user) => {
      setEditUserData(user);
    };
  
    const openPasswordModal = (user) => {
      setEditPasswordData({
        id: user.id,
        newPassword: '',
        confirmNewPassword: ''
      });
    };

  return (
    <section>
            <div className='row'>
              <div className='col-12'>
              <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          Ajouter membre
          <i className="fa fa-plus" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
          
        </button>
              </div>
            </div>
            <div className="desktop-only">
            <table className="table">
          <thead>
            <tr>
              <th scope="col">Prénom</th>
              <th scope="col">Nom</th>
              <th scope="col">Email</th>
              <th scope="col">Laboratoire</th>
              <th scope="col">Equipe</th>
              <th scope="col" className='text-center'>Livres</th>
              <th scope="col" className='text-center'>Articles</th>
              <th scope="col">Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {users.length === 0 ? (
                <div className='col-12'>
                  <div className="alert alert-danger" role="alert">
                    Aucun user trouvé.
                  </div>
                </div>
              ) : (
                users.filter(user => user.id !== userInfo.id).map(user => (
            <tr>
            <td>{user.prénom}</td>
            <td>{user.nom}</td>
            <td>{user.email}</td>
            <td>{user.laboratoire.nom}</td>
            <td>{user.equipe.nom}</td>
            <td className='text-center'>
            <a style={{ cursor: 'pointer' }} onClick={() => onUserClick(user.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-book" viewBox="0 0 16 16">
        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
        </svg>
            </a>
            </td>
            <td className='text-center'>
            <a style={{ cursor: 'pointer' }} onClick={() => onUserArtClick(user.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-journal-bookmark" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8"/>
        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
        </svg>
            </a>
            </td>
            <td style={{ color: getRoleLabel(user.role).color }}>
                {getRoleLabel(user.role).label}
              </td>
              <td>
                      {/*<a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>*/}
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                      <a
                        href="#"
                        style={{ color: '#28a745' }}
                        aria-label="Change Password"
                        onClick={() => openPasswordModal(user)}
                        data-toggle="modal"
                        data-target="#passwordModal"
                      >
                        <i className="fa fa-key" aria-hidden="true"></i>
                      </a>
                    </td>
          </tr>
          )))}
            
          </tbody>
        </table>
            </div>
            
        <div className='mobile-only'>
        {users.length === 0 ? (
                <div className='col-12'>
                  <div className="alert alert-danger" role="alert">
                    Aucun user trouvé.
                  </div>
                </div>
              ) : (
                users.filter(user => user.id !== userInfo.id).map(user => (
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle mr-2 mb-1" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
{user.prénom} {user.nom}</div>
                <div className="card-body text-center">
                  <div className="small font-italic text-muted mb-1 text-left">
                    <p><span>Email :</span> {user.email}</p>
                    <p><span>Laboratoire :</span> {user.laboratoire.nom}</p>
                    <p><span>Equipe :</span> {user.equipe.nom}</p>
                    <p><span>Role :</span> <span style={{ color: getRoleLabel(user.role).color }}>{getRoleLabel(user.role).label}</span></p>

                    <p><span>Livres :</span> <a style={{ cursor: 'pointer' }} onClick={() => onUserClick(user.id)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" style={{color:'#007bff'}} height="20" fill="currentColor" className="bi bi-book ml-2" viewBox="0 0 16 16">
        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783"/>
        </svg>
            </a></p>
            <p><span>Articles :</span> <a style={{ cursor: 'pointer' }} onClick={() => { setActiveTab('userArt'); setSelectedUserIdArt(user.id); }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" style={{color:'#007bff'}} height="20" fill="currentColor" className="bi bi-journal-bookmark ml-2" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M6 8V1h1v6.117L8.743 6.07a.5.5 0 0 1 .514 0L11 7.117V1h1v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8"/>
        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2"/>
        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z"/>
        </svg>
            </a></p>
            
                  </div>
                  <hr />
                  <div className='actions mt-2 text-right'>
            {/*<a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>hh
                      </a>*/}
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(user)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        style={{ color: '#28a745' }}
                        aria-label="Change Password"
                        onClick={() => openPasswordModal(user)}
                        data-toggle="modal"
                        data-target="#passwordModal"
                      >
                        <i className="fa fa-key" aria-hidden="true"></i>
                      </a>
            </div>
                </div>
              </div>
              )))}
        </div>

        {/* Change Password Modal */}
      <div className="modal fade" id="passwordModal" tabIndex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title" id="passwordModalLabel">تغيير كلمة المرور</h5>

            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="newPassword" style={{ float: 'right' }}>كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={editPasswordData.newPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmNewPassword" style={{ float: 'right' }}>تأكيد كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={editPasswordData.confirmNewPassword}
                    onChange={handleEditPasswordDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closePasswordModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={editPassword}>تغيير</button>
            </div>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة مستخدم جديد</h5>
            
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group tex-right">
                  <label htmlFor="prénom" style={{ float: 'right' }}>الإسم</label>
                  <input
                    type="text"
                    className="form-control"
                    id="prénom"
                    name="prénom"
                    value={newUserData.prénom}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="nom" style={{ float: 'right' }}>النسب</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nom"
                    name="nom"
                    value={newUserData.nom}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="laboratoire_id" style={{ float: 'right' }}>المختبر</label>
                  <select
                    className="form-control"
                    id="laboratoire_id"
                    name="laboratoire_id"
                    value={newUserData.laboratoire_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر المختبر</option>
                    {LaboInfos.map(laboratoire => (
        <option key={laboratoire.id} value={laboratoire.id}>{laboratoire.nom}</option>
      ))}
                    
                  </select>
                </div>
                <div className="form-group tex-right" style={{ display: 'none' }}>
                  <label htmlFor="equipe_id" style={{ float: 'right' }}>الفريق</label>
                  <select
                  disabled
                    className="form-control"
                    id="equipe_id"
                    name="equipe_id"
                    value={newUserData.equipe_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر الفريق</option>
                    {EquipesInfos.map(equipe => (
        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
      ))}
                  </select>
                </div>
                <div className="form-group tex-right" style={{ display: 'none' }}>
                  <label htmlFor="role" style={{ float: 'right' }}>الدور</label>
                  <select
                  disabled
                    className="form-control"
                    id="role"
                    name="role"
                    value="0"
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" >اختر الدور</option>
                    <option value="0" disabled>مستخدم</option>
                    <option value="1">مسؤول الفريق</option>
                    <option value="2">مسؤول المختبر</option>
                    <option value="3">مسؤول</option>
                  </select>
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="email" style={{ float: 'right' }}>البريد الإلكتروني</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="password" style={{ float: 'right' }}>كلمة المرور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={newUserData.password}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="confirmPassword" style={{ float: 'right' }}>تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={newUserData.confirmPassword}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>إضافة</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div
        className="modal fade"
        id="editModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="editModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir="rtl">
              <h5 className="modal-title" id="editModalLabel">
                تعديل معلومات المستخدم
              </h5>
            </div>
            <div className="modal-body">
              {editUserData && (
                <form>
                  <div className="form-group tex-right">
                    <label htmlFor="editprénom" style={{ float: "right" }}>
                      الإسم
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editprénom"
                      name="prénom"
                      value={editUserData.prénom}
                      onChange={handleEditUserDataChange}
                      required
                    />
                  </div>
                  <div className="form-group tex-right">
                    <label htmlFor="editnom" style={{ float: "right" }}>
                      النسب
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="editnom"
                      name="nom"
                      value={editUserData.nom}
                      onChange={handleEditUserDataChange}
                      required
                    />
                  </div>
                  <div className="form-group tex-right">
                    <label
                      htmlFor="editlaboratoire_id"
                      style={{ float: "right" }}
                    >
                      المختبر
                    </label>
                    <select
                      className="form-control"
                      id="editlaboratoire_id"
                      name="laboratoire_id"
                      value={editUserData.laboratoire_id}
                      onChange={handleEditUserDataChange}
                      required
                    >
                      {LaboInfos.map((laboratoire) => (
                        <option key={laboratoire.id} value={laboratoire.id}>
                          {laboratoire.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group tex-right">
                    <label htmlFor="editEmail" style={{ float: "right" }}>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="editEmail"
                      name="email"
                      value={editUserData.email}
                      onChange={handleEditUserDataChange}
                      required
                    />
                  </div>
                </form>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                style={{ borderRadius: "0", padding: "3px 16px" }}
                data-dismiss="modal"
                id="closeEditModalBtn"
              >
                إلغاء
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={editUser}
              >
                تحديث
              </button>
            </div>
          </div>
        </div>
      </div>
          </section>
  );
}

Users.propTypes = {
  onUserClick: PropTypes.func.isRequired,
  onUserArtClick: PropTypes.func.isRequired,
};

export default Users;
