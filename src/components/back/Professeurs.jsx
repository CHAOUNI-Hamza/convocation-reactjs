import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../css/global.css';

function Professeurs() {
  const [datas, setDatas] = useState([]);
  const [error, setError] = useState(null);
  const [newData, setNewData] = useState({
    sum_number: '',
    name: '',
    first_name: '',
    name_ar: '',
    first_name_ar: '',
    email: '',
  });
  const [editData, setEditData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get(`/teachers?page=${page}`);
      setDatas(response.data.data);
      setCurrentPage(page);
      setTotalPages(response.data.meta.last_page); // Assurez-vous que votre API retourne `meta.last_page`
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Une erreur s'est produite lors du chargement des données.");
    }
  };

  const fetchAllDataForExcel = async () => {
    try {
      // Ici vous faites une requête pour récupérer toutes les données sans pagination
      const response = await axios.get('/teachers/all'); // Vérifiez si votre API permet cela
      return response.data.data; // Retourne toutes les données sans pagination
    } catch (error) {
      console.error("Error fetching all data:", error);
      setError("Une erreur s'est produite lors du chargement des données.");
    }
  };

  
  useEffect(() => {
    fetchData();
    fetchAllDataForExcel();
  }, []); // Ajout d'un tableau de dépendances vide pour exécuter fetchData une seule fois au montage  
  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewData((newData) => ({ ...newData, [name]: value }));
  };

  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditData((editData) => ({ ...editData, [name]: value }));
  };

  const validateForm = ({ sum_number, name, first_name, name_ar, first_name_ar, email }) => {
    if (!sum_number || !name || !first_name || !name_ar || !first_name_ar || !email) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires !',
      });
      return false;
    }
  
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "L'email est invalide !",
      });
      return false;
    }
    
    return true;
  };
  

  const addData = async () => {
    if (!validateForm(newData)) return;
    try {
      await axios.post('teachers', newData);
      Swal.fire({
        title: "Ok",
        text: "Ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
        setNewData({
          sum_number: '',
          name: '',
          first_name: '',
          name_ar: '',
          first_name_ar: '',
          email: '',
        });        
        fetchData();
      });
    } catch (error) {
      handleApiError(error, "Une erreur s'est produite lors de l'ajout.");
    }
  };
  

  const updateData = async () => {
    if (!validateForm(editData)) return;
    try {
      await axios.put(`teachers/${editData.id}`, editData );
      fetchData();
      Swal.fire({
        title: "Ok",
        text: "Les informations ont été mises à jour avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      handleApiError(error, "Une erreur s'est produite lors de la mise à jour des informations.");
    }
  };
  
  const deleteData = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Êtes-vous sûr ?",
        text: "Vous ne pourrez pas revenir en arrière !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, supprimez-le !"
      });

      if (result.isConfirmed) {
        await axios.delete(`/teachers/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
          text: "Supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting Professeur:', error);
      setError('حدث خطأ أثناء الحذف .');
    }
  };

  const openEditModal = (professeur) => {
    setEditData(professeur);
  };

  const clearFilters = () => {
    fetchData();
  };

  const handleApiError = (error, defaultMessage) => {
    if (error.response && error.response.data.errorDate) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: error.response.data.errorDate,
      });
    } else {
      console.error(defaultMessage, error);
      setError(defaultMessage);
    }
  };

  const convertToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data.map(professeur => ({
    'Som': professeur.sum_number,
    'Nom': professeur.name,
    'Prénom': professeur.first_name,
    'Nom Ar': professeur.name_ar,
    'Prénom Ar': professeur.first_name_ar,
    'Email': professeur.email,
  })));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Professeurs');

  return wb;
};

const downloadExcel = async () => {
  const allData = await fetchAllDataForExcel();  // Récupérer toutes les données pour l'export
  const wb = convertToExcel(allData);  // Convertir ces données en Excel
  XLSX.writeFile(wb, 'professeurs.xlsx');  // Télécharger le fichier Excel
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
          Ajouter
        </button>
        <div className="card">
          <div className="card-header" style={{ textAlign: 'right' }}>
          <h3 className="card-title font-arabic p-2" style={{ borderBottom: 'none',
    paddingBottom: '0' }}> Liste des professeurs</h3>
          <button
  type="button"
  className="btn btn-success"
  onClick={downloadExcel}
  aria-label="تحميل"
>
  <svg xmlns="http://www.w3.org/2000/svg" width="16" style={{ marginRight: '5px' }} height="16" fill="currentColor" className="bi bi-file-earmark-spreadsheet" viewBox="0 0 16 16">
  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V9H3V2a1 1 0 0 1 1-1h5.5zM3 12v-2h2v2zm0 1h2v2H4a1 1 0 0 1-1-1zm3 2v-2h3v2zm4 0v-2h3v1a1 1 0 0 1-1 1zm3-3h-3v-2h3zm-7 0v-2h3v2z"/>
</svg>
Télécharger
</button>
          
          
            
    <div className="card-tools" style={{ marginRight: '10rem' }}>
          </div>
          <div className="filter-group">
          </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Som</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Nom Ar</th>
                  <th>Prénom Ar</th>
                  <th>Email</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {datas.map(data => (
                  <tr key={data.id}>
                    <td>{data.sum_number}</td>
                    <td>{data.name}</td>
                    <td>{data.first_name}</td>
                    <td>{data.name_ar}</td>
                    <td>{data.first_name_ar}</td>
                    <td>{data.email}</td>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteData(data.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(data)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>









              <div className="pagination p-2 ml-3">
  <p
    className="text-white bg-primary p-2" style={{ cursor: 'pointer' }}
    disabled={currentPage === 1}
    onClick={() => fetchData(currentPage - 1)}
  >
    Précédent
  </p>

  <span className="p-2" style={{ margin: "0 10px" }}>
    Page {currentPage} sur {totalPages}
  </span>

  <p
    className="text-white bg-primary p-2" style={{ cursor: 'pointer' }}
    disabled={currentPage === totalPages}
    onClick={() => fetchData(currentPage + 1)}
  >
    Suivant
  </p>
</div>











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
                <div className="form-group">
                  <label htmlFor="sum_number">Som</label>
                  <input type="text" className="form-control" id="sum_number" name="sum_number" value={newData.sum_number} onChange={handleNewDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={newData.name} onChange={handleNewDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">Prénom</label>
                  <input type="text" className="form-control" id="first_name" name="first_name" value={newData.first_name} onChange={handleNewDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name_ar">Nom Ar</label>
                  <input type="text" className="form-control" id="name_ar" name="name_ar" value={newData.name_ar} onChange={handleNewDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name_ar">Prénom Ar</label>
                  <input type="text" className="form-control" id="first_name_ar" name="first_name_ar" value={newData.first_name_ar} onChange={handleNewDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={newData.email} onChange={handleNewDataChange} required />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">Annuler</button>
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-primary" onClick={addData}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editData && ( 
  <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title font-arabic" id="editModalLabel">  Modifier </h5>
        </div>
        <div className="modal-body">
          <form>
          <div className="form-group">
                  <label htmlFor="sum_number">Som</label>
                  <input type="text" className="form-control" id="sum_number" name="sum_number" value={editData.sum_number} onChange={handleEditDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={editData.name} onChange={handleEditDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">Prénom</label>
                  <input type="text" className="form-control" id="first_name" name="first_name" value={editData.first_name} onChange={handleEditDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name_ar">Nom Ar</label>
                  <input type="text" className="form-control" id="name_ar" name="name_ar" value={editData.name_ar} onChange={handleEditDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name_ar">Prénom Ar</label>
                  <input type="text" className="form-control" id="first_name_ar" name="first_name_ar" value={editData.first_name_ar} onChange={handleEditDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={editData.email} onChange={handleEditDataChange} required />
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">Annuler</button>
          <button type="button" className="btn btn-primary" style={{borderRadius: '0',
    padding: '3px 16px'}} onClick={updateData}>Modifier</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Professeurs;
