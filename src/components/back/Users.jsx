import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/users.css';
import { UserContext } from '../../UserContext';

function Users() {
  const { userInfo } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [editUserData, setEditUserData] = useState(null);
  const [editPasswordData, setEditPasswordData] = useState({
    id: null,
    newPassword: '',
    confirmNewPassword: ''
  });

  const fetchData = async () => {
    setError(null);
    try {
      const response = await axios.get('/users');
      setUsers(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des données :', error);
    }
  };
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
    const { name, email, password } = newUserData;
    if (!name || !email || !password ) {
      Swal.fire({
        icon: 'error',
        title: 'erreur',
        text: 'Veuillez remplir tous les champs obligatoires !',
      });
      return;
    }
    /*if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'erreur',
        text: 'Le mot de passe et la confirmation du mot de passe ne correspondent pas !',
      });
      return;
    }*/
    try {
      await axios.post('/users', { name, email, password });
      Swal.fire({
        title: "تم",
        text: "Un nouvel utilisateur a été ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewUserData({
        name: '',
        email: '',
        password: 0,
      });
    } catch (error) {
      console.error('Error adding user:', error);
      setError("Une erreur s'est produite lors de l'ajout de l'utilisateur.");
    }
  };

  const editUser = async () => {
    try {
      const { id, name, email } = editUserData;
      await axios.put(`/users/${id}`, { name, email });
      fetchData();
      Swal.fire({
        title: "Ok",
        text: "Les informations utilisateur ont été mises à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating user:', error);
      setError("Une erreur s'est produite lors de la mise à jour des informations utilisateur.");
    }
  };

  const editPassword = async () => {
    const { id, newPassword, confirmNewPassword } = editPasswordData;
    if (!newPassword || !confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'erreur',
        text: 'Veuillez saisir un nouveau mot de passe et confirmer le mot de passe !',
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      Swal.fire({
        icon: 'error',
        title: 'erreur',
        text: 'Le nouveau mot de passe et la confirmation du mot de passe ne correspondent pas !',
      });
      return;
    }
    try {
      await axios.put(`/users/${id}/password`, { newPassword: newPassword });
      fetchData();
      Swal.fire({
        title: "Ok",
        text: "Le mot de passe a été mis à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closePasswordModalBtn').click();
      });
    } catch (error) {
      console.error('Error updating password:', error);
      setError("Une erreur s'est produite lors de la mise à jour du mot de passe.");
    }
  };

  const deleteUser = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas annuler cette action !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimez-la !"
      });

      if (result.isConfirmed) {
        await axios.delete(`/users/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
          text: "L'utilisateur a été supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Une erreur est survenue lors de la suppression de l\'utilisateur.');
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

  useEffect(() => {
    fetchData();
  }, []);

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
          Ajouter
        </button>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title p-2">Liste des utilisateurs</h3>

          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Nom et Prénom</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
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
            <div className="modal-header">
              <h5 className="modal-title font-arabic" id="exampleModalLabel">Ajouter</h5>
            
            </div>
            <div className="modal-body">
              <form>
                <div className="form-group tex-right">
                  <label htmlFor="name">Nom et Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={newUserData.name}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    id="email"
                    name="email"
                    value={newUserData.email}
                    onChange={handleNewUserDataChange}
                    required
                  />
                </div>
                <div className="form-group tex-right">
                  <label htmlFor="password">Mot de passe</label>
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
                  <label htmlFor="confirmPassword">Confirmation Mot de passe</label>
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
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="closeModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={addUser}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editModalLabel">Modifier</h5>
            </div>
            <div className="modal-body">
              {editUserData && (
                <form>
                  <div className="form-group">
                  <label htmlFor="editname">Nom et Prénom</label>
                  <input
                    type="text"
                    className="form-control"
                    id="editname"
                    name="name"
                    value={editUserData.name}
                    onChange={handleEditUserDataChange}
                    required
                  />
                </div>
                  <div className="form-group">
                    <label htmlFor="editEmail">Email</label>
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
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="closeEditModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={editUser}>Modifier</button>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <div className="modal fade" id="passwordModal" tabIndex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="passwordModalLabel">Modifier</h5>

            </div>
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <label htmlFor="newPassword">Nouveau mot de passe</label>
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
                  <label htmlFor="confirmNewPassword">Confirmation de mot de passe</label>
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
    padding: '3px 16px'}} data-dismiss="modal" id="closePasswordModalBtn">Annuler</button>
              <button type="button" className="btn btn-primary" onClick={editPassword}>modifier</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
