import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../../UserContext';
import Swal from 'sweetalert2';
import axios from 'axios';
import logoUser from '../../../assets/logoUser.jpg';

export default function CardProfil({handleLogout}) {
  const [editUserData, setEditUserData] = useState(null);
  const { userInfo } = useContext(UserContext);
  const handleEditUserDataChange = (e) => {
    const { name, value } = e.target;
    setEditUserData({ ...editUserData, [name]: value });
  };
  const alert = () => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "تم تحديث معلوماتك بنجاح."
    });
  }
  const editUser = async () => {
    try {
      const { id, nom, prénom, role = userInfo.role, email, laboratoire_id = userInfo.labo_id , equipe_id = userInfo.equipe_id } = editUserData;
      await axios.put(`/users/${id}`, { nom, prénom, role, email, laboratoire_id, equipe_id });
      alert();
      setTimeout(() => {
        window.location.reload();
    }, 3000);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  const openEditModal = (user) => {
    setEditUserData(user);
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
    const handleEditPasswordDataChange = (e) => {
      const { name, value } = e.target;
      setEditPasswordData({ ...editPasswordData, [name]: value });
    };

    const openPasswordModal = (user) => {
      setEditPasswordData({
        id: user.id,
        newPassword: '',
        confirmNewPassword: ''
      });
    };
    
    const [editPasswordData, setEditPasswordData] = useState({
      id: null,
      newPassword: '',
      confirmNewPassword: ''
    });
  return (
    
        <div className="col-xl-4">
            {userInfo && (
        <div className="card mb-4 mb-xl-0">
          <div className="card-header">Informations personnelles</div>
          <div className="card-body text-center">
            <img className="img-account-profile rounded-circle mb-2" src={logoUser} alt="Profile" />
            <div className="small font-italic text-muted mb-4">{userInfo.prénom} {userInfo.nom}</div>
            <div className="small font-italic text-muted mb-1">
              <p><span>Email :</span> {userInfo.email}</p>
              <p><span>Laboratoire :</span> {userInfo.laboratoire}</p>
              <p><span>Equipe :</span> {userInfo.equipe}</p>
            </div>
            <button className="btn btn-secondary w-100 mr-0 ml-0 mb-2" type="button" data-toggle="modal"
                        data-target="#editModal" aria-label="Edit" onClick={() => openEditModal(userInfo)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-fill mr-2" viewBox="0 0 16 16">
        <path d="M12.146.854a.5.5 0 0 1 .708 0l2.292 2.292a.5.5 0 0 1 0 .708L12.207 6.792l-3-3L12.146.854zm-.853.353L3.5 9.5V11h1.5l8-8-1.707-1.707zM1 13.5V16h2.5l7.646-7.646-2.5-2.5L1 13.5z"/>
      </svg>
      Édition
    </button>

    <button className="btn btn-warning w-100 mr-0 ml-0 mb-2 text-white" type="button" aria-label="Change Password" data-toggle="modal"
                        data-target="#passwordModal" onClick={() => openPasswordModal(userInfo)}>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock-fill mr-2" viewBox="0 0 16 16">
        <path d="M8 1a4 4 0 0 1 4 4v3H4V5a4 4 0 0 1 4-4zM3 7h10a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z"/>
      </svg>
      Changer le mot de passe
    </button>
            <button className="btn btn-primary w-100 mr-0 ml-0 mb-2" type="button" onClick={handleLogout}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-left mr-2" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
        )}


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

      </div>
      
  );
}
