import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { UserContext } from '../../UserContext';

function Users() {
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [LaboInfos, setLaboInfo] = useState([]);
  const [EquipesInfos, setEquipeInfo] = useState([]);
  const [newUserData, setNewUserData] = useState({
    nom: '',
    prénom: '',
    role: '',
    email: '',
    password: '',
    confirmPassword: '',
    laboratoire_id: '',
    equipe_id: ''
  });
  const [editUserData, setEditUserData] = useState(null);
  const [editPasswordData, setEditPasswordData] = useState({
    id: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  const getRoleLabel = (role) => {
    switch(role) {
      case 0: return { label: "أستاذ باحث", color: "green" };
      case 1: return { label: "رئيس الفريق", color: "orange" };
      case 2: return { label: "رئيس المختبر", color: "blue" };
      case 3: return { label: "مسؤول", color: "red" };
      default: return { label: "Unknown", color: "black" };
    }
  };

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
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

    fetchLaboAndEquipesData();
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  

  const handleNewUserDataChange = (e) => {
    const { name, value } = e.target;
    setNewUserData({ ...newUserData, [name]: value });
  };

  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };

  const handleEditPasswordDataChange = (e) => {
    const { name, value } = e.target;
    setEditPasswordData({ ...editPasswordData, [name]: value });
  };

  const addUser = async () => {
    const { nom, prénom, role, email, password, confirmPassword, laboratoire_id, equipe_id } = newUserData;
    if (!nom || !prénom || !role || !email || !password || !confirmPassword || !laboratoire_id || !equipe_id ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
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
      Swal.fire({
        title: "تم",
        text: "تمت إضافة مستخدم جديد بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewUserData({
        nom: '',
        prénom: '',
        role: 0,
        email: '',
        password: '',
        confirmPassword: '',
        laboratoire_id: '',
        equipe_id: ''
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError('حدث خطأ أثناء إضافة المستخدم.');
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
      setError('حدث خطأ أثناء تحديث معلومات المستخدم.');
    }
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
      setError('حدث خطأ أثناء تحديث كلمة المرور.');
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
      setError('حدث خطأ أثناء حذف المستخدم.');
    }
  };

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
    paddingBottom: '0' }}>لائحة المستخدمين</h3>

          </div>






          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr style={{ textAlign: 'right' }}>
                  <th>إجراءات</th>
                  <th>الدور</th>
                  <th>الفريق</th>
                  <th>المختبر</th>
                  <th>البريد الإلكتروني</th>
                  <th>الإسم و النسب</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(user => user.id === userInfo.id).map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
                    <td style={{ background: 'cornsilk' }}>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)} 
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
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
                    <td style={{ color: getRoleLabel(user.role).color, background: 'cornsilk' }}>
                    {getRoleLabel(user.role).label}
                    </td>
                    <td style={{ background: 'cornsilk' }}>{user.equipe.nom}</td>
                    <td style={{ background: 'cornsilk' }}>{user.laboratoire.nom}</td>
                    <td style={{ background: 'cornsilk' }}>{user.email}</td>
                    <td style={{ background: 'cornsilk' }}>{user.nom} {user.prénom}</td>
                  </tr>
                ))}
              </tbody>
              <tbody>
                {users.filter(user => user.id !== userInfo.id).map(user => (
                  <tr key={user.id} style={{ textAlign: 'right' }}>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteUser(user.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
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
                    <td style={{ color: getRoleLabel(user.role).color }}>
                    {getRoleLabel(user.role).label}
                    </td>
                    <td>{user.equipe.nom}</td>
                    <td>{user.laboratoire.nom}</td>
                    <td>{user.email}</td>
                    <td>{user.nom} {user.prénom}</td>
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
                <div className="form-group tex-right">
                  <label htmlFor="equipe_id" style={{ float: 'right' }}>الفريق</label>
                  <select
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
                <div className="form-group tex-right">
                  <label htmlFor="role" style={{ float: 'right' }}>الدور</label>
                  <select
                    className="form-control"
                    id="role"
                    name="role"
                    value={newUserData.role}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر الدور</option>
                    <option value="0">مستخدم</option>
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
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header"  dir='rtl'>
              <h5 className="modal-title" id="editModalLabel">تعديل معلومات المستخدم</h5>
            </div>
            <div className="modal-body">
              {editUserData && (
                <form>
                  <div className="form-group tex-right">
                  <label htmlFor="editprénom" style={{ float: 'right' }}>الإسم</label>
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
                  <label htmlFor="editnom" style={{ float: 'right' }}>النسب</label>
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
                  <label htmlFor="editlaboratoire_id" style={{ float: 'right' }}>المختبر</label>
                  <select
                    className="form-control"
                    id="editlaboratoire_id"
                    name="laboratoire_id"
                    value={editUserData.laboratoire_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    {LaboInfos.map(laboratoire => (
        <option key={laboratoire.id} value={laboratoire.id}>{laboratoire.nom}</option>
      ))}
                  </select>
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="editequipe_id" style={{ float: 'right' }}>الفريق</label>
                  <select
                    className="form-control"
                    id="editequipe_id"
                    name="equipe_id"
                    value={editUserData.equipe_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    {EquipesInfos.map(equipe => (
        <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
      ))}
                  </select>
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="editrole" style={{ float: 'right' }}>الدور</label>
                  <select
                    className="form-control"
                    id="editrole"
                    name="role"
                    value={editUserData.role}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="0">مستخدم</option>
                    <option value="1">مسؤول الفريق</option>
                    <option value="2">مسؤول المختبر</option>
                    <option value="3">مسؤول</option>
                  </select>
                </div>
                  <div className="form-group tex-right">
                    <label htmlFor="editEmail" style={{ float: 'right' }}>البريد الإلكتروني</label>
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
              <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} data-dismiss="modal" id="closeEditModalBtn">إلغاء</button>
              <button type="button" className="btn btn-primary" onClick={editUser}>تحديث</button>
            </div>
          </div>
        </div>
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
    </div>
  );
}

export default Users;
