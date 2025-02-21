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
    const [error, setError] = useState(null);
    const [LaboInfos, setLaboInfo] = useState([]);
    const [UserInfos, setUserInfo] = useState([]);
    const [EquipesInfos, setEquipeInfo] = useState([]);
    const [editUserData, setEditUserData] = useState(null);
    const [selectedEquipe, setSelectedEquipe] = useState('');
    const [newUserData, setNewUserData] = useState({
        nom: '',
        laboratoire_id: userInfo?.labo_id || '',
      });

    const fetchLaboratoires = async () => {
        try {
          {/*const response = await axios.get('/laboratoires');
          setUserInfo(response.data.data);*/}
        } catch (error) {
          console.error('There was an error fetching labo data!', error);
        }
      };

    const fetchData = async () => {
      if(userInfo && userInfo.labo_id) {
        try {
          const response = await axios.get(`/laboratoire/${userInfo.labo_id}/equipes`);
          setUsersEquipe(response.data.data);
        } catch (error) {
          console.error('There was an error fetching users labo!', error);
        }
    }
    };

    const handleEditUserDataChange = (e) => {
        const { name, value } = e.target;
        setEditUserData({ ...editUserData, [name]: value });
      };

    useEffect(() => {
        fetchLaboratoires();
      fetchData();
    }, [userInfo]);


    const editUser = async () => {
        try {
          const { id, nom, laboratoire_id } = editUserData;
          await axios.put(`/equipes/${id}`, { nom, laboratoire_id });
          fetchData();
          Swal.fire({
            title: "تم",
            text: "تم تحديث المعلومات بنجاح.",
            icon: "success"
          }).then(() => {
            document.getElementById('closeEditModalBtn').click();
          });
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

    const addUser = async () => {
        const { nom, laboratoire_id } = newUserData;
        if (!nom || !laboratoire_id ) {
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى ملء جميع الحقول المطلوبة!',
          });
          return;
        }
        try {
          await axios.post('/equipes', { nom, laboratoire_id });
          fetchData();
          setNewUserData({
            nom: '',
            laboratoire_id: '',
          });
          Swal.fire({
            title: "تم",
            text: "تمت الإضافة بنجاح.",
            icon: "success"
          }).then(() => {
            document.getElementById('closeModalBtn').click();
          });
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
            await axios.delete(`/equipes/${id}`);
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

      const handleNewUserDataChange = (e) => {
        const { name, value } = e.target;
        setNewUserData({ ...newUserData, [name]: value });
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
              <div className='col-6'>
              <button
          type="button"
          data-toggle="modal"
          data-target="#exampleModal"
          className="btn btn-success btn-flat mb-3"
          aria-label="إضافة"
          style={{ padding: '3px 11px' }}
        >
          Ajouter equipe
          <i className="fa fa-plus" aria-hidden="true" style={{ marginLeft: '5px' }}></i>
          
        </button>
        
              </div>
            </div>
            <div className="desktop-only">
            <table className="table">
          <thead>
            <tr>
              <th scope="col">nom</th>
              <th>laboratoire</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {users.length === 0 ? (
                <div className='col-12'>
                  <div className="alert alert-danger" role="alert">
                    Aucun equipe trouvé.
                  </div>
                </div>
              ) : (
                users.map(user => (
            <tr>
            <td>{user.nom}</td>
            <td>{user.laboratoire.nom}</td>
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
                    Aucun equipe trouvé.
                  </div>
                </div>
              ) : (
                users.map(user => (
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-circle mr-2 mb-1" viewBox="0 0 16 16">
  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
  <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
</svg>
 {user.nom}</div>
                <div className="card-body text-center">
                  <div className="small font-italic text-muted mb-1 text-left">
                    <p><span>Nom :</span> {user.nom}</p>
                    <p><span>Laboratoire :</span> {user.laboratoire.nom}</p>

                  </div>
                  <hr />
                  <div className='actions mt-2 text-right'>
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
            </div>
                </div>
              </div>
              )))}
        </div>


        {/* Add User Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header" dir='rtl'>
              <h5 className="modal-title font-arabic" id="exampleModalLabel">إضافة فريق</h5>
            </div>
            <div className="modal-body" dir='rtl'>
              <form>
                <div className="form-group text-right">
                  <label htmlFor="addnom">الإسم</label>
                  <input type="text" className="form-control" id="addnom" name="nom" value={newUserData.nom} onChange={handleNewUserDataChange} required />
                </div>
                <div className='form-group' style={{ display: 'none' }}>
                  <label htmlFor="addlaboratoire_id">المختبر </label>
                  <select
                    className="form-control"
                    id="addlaboratoire_id"
                    name='laboratoire_id'
                    value={newUserData.laboratoire_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر المختبر </option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom}</option>
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
{editUserData && ( 
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel"> تعديل</h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="nom">الإسم</label>
                  <input type="text" className="form-control" id="nom" name="nom" value={editUserData.nom} onChange={handleEditUserDataChange} required />
                </div>

                <div className='form-group' style={{ display: 'none' }}>
                  <label htmlFor="laboratoire_id">المختبر </label>
                  <select
                    className="form-control"
                    id="laboratoire_id"
                    name='laboratoire_id'
                    value={editUserData.laboratoire_id}
                    onChange={handleEditUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر المختبر</option>
                    {UserInfos.map(user => (
        <option key={user.id} value={user.id}>{user.nom}</option>
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
          </section>
  );
}

Users.propTypes = {
  onUserClick: PropTypes.func.isRequired,
  onUserArtClick: PropTypes.func.isRequired,
};

export default Users;
