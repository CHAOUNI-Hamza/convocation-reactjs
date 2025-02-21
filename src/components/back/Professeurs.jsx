import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../css/users.css';

function Professeurs() {
  const [professeurs, setProfesseurs] = useState([]);
  //const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  //const [selectedAnnee, setSelectedAnnee] = useState('');
  //const [selectedLaboratoire, setSelectedLaboratoire] = useState('');
  //const [selectedEquipe, setSelectedEquipe] = useState('');
  //const [laboratoires, setLaboratoire] = useState([]);

  //const [equipes, setEquipe] = useState([]);

  const [newProfesseurData, setNewProfesseurData] = useState({
    sum_number: '',
    name: '',
    first_name: '',
    name_ar: '',
    first_name_ar: '',
    email: '',
  });
  const [editProfesseurData, setEditProfesseurData] = useState(null);

  const fetchData = async () => {
    setError(null);
    try {
      /*const response = await axios.get('/articles', {
        params: { 
          annee: selectedAnnee, 
          laboratoire_id: selectedLaboratoire,
          equipe_id: selectedEquipe,  
        }
      });*/
      const response = await axios.get('/teachers');
      setProfesseurs(response.data.data);
      console.log("test");
      console.log(response.data.data);
      console.log("test");
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  /*useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersResponse, laboResponse, equipeResponse] = await Promise.all([
          axios.get('/users'),
          axios.get('/laboratoires'),
        ]);
        setUsers(usersResponse.data.data);
        setLaboratoire(laboResponse.data.data);
      } catch (error) {
        console.error('There was an error fetching data!', error);
      }
    };

    fetchInitialData();
    fetchData();
  }, []);*/
  useEffect(() => {
    fetchData();
  });
  
  /*useEffect(() => {
    fetchData();
  }, [selectedAnnee, selectedLaboratoire, selectedEquipe]);*/

  /*const fetchEquipesByLaboratoire = async (laboratoireId) => {
    try {
      const response = await axios.get(`/laboratoire/${laboratoireId}/equipes`);
      setEquipe(response.data.data);
    } catch (error) {
      console.error('Error fetching equipes:', error);
    }
  };*/

  /*useEffect(() => {
    if (selectedLaboratoire) {
      fetchEquipesByLaboratoire(selectedLaboratoire);
    } else {
      setEquipe([]); // Réinitialiser les équipes si aucun laboratoire n'est sélectionné
    }
  }, [selectedLaboratoire]);*/
  

  const handleNewProfesseurDataChange = (e) => {
    const { name, value } = e.target;
    setNewProfesseurData((newProfesseurData) => ({ ...newProfesseurData, [name]: value }));
  };

  const handleEditProfesseurDataChange = (e) => {
    const { name, value } = e.target;
    setEditProfesseurData((editProfesseurData) => ({ ...editProfesseurData, [name]: value }));
  };

  const addProfesseur = async () => {
    const { sum_number, name, first_name, name_ar, first_name_ar, email } = newProfesseurData;
    if (!sum_number || !name || !first_name || !name_ar || !first_name_ar || !email ) {
      Swal.fire({
        icon: 'error',
        title: 'خطأ',
        text: 'يرجى ملء جميع الحقول المطلوبة!',
      });
      return;
    }
    try {
      await axios.post('admin/teachers', { sum_number, name, first_name, name_ar, first_name_ar, email });
      Swal.fire({
        title: "تم",
        text: "تمت الإضافة بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
      });
      fetchData();
      setNewProfesseurData({
        titre: '',
        revue: '',
        url: '',
        annee: '',
        user_id: '',
      });
    } catch (error) {
      handleApiError(error, 'حدث خطأ أثناء الإضافة .');
    }
  };

  const editProfesseur = async () => {
    try {
      const { id, sum_number, name, first_name, name_ar, first_name_ar, email } = editProfesseurData;
      await axios.put(`admin/teachers/${id}`, { sum_number, name, first_name, name_ar, first_name_ar, email });
      fetchData();
      Swal.fire({
        title: "تم",
        text: "تم تحديث المعلومات بنجاح.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeEditModalBtn').click();
      });
    } catch (error) {
      handleApiError(error, 'حدث خطأ أثناء تحديث المعلومات .');
    }
  };

  const deleteProfesseur = async (id) => {
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
        await axios.delete(`/teachers/${id}`);
        fetchData();
        Swal.fire({
          title: "تم الحذف!",
          text: "تم الحذف بنجاح.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting Professeur:', error);
      setError('حدث خطأ أثناء الحذف .');
    }
  };

  const openEditModal = (professeur) => {
    setEditProfesseurData(professeur);
  };

  const clearFilters = () => {
    //setSelectedAnnee('');
    //setSelectedLaboratoire('');
    //setSelectedEquipe('');
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

const downloadExcel = () => {
  const wb = convertToExcel(professeurs);
  XLSX.writeFile(wb, 'professeurs.xlsx');
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
            {/*<select className="form-select" style={{ width: '20%' }} value={selectedAnnee} onChange={(e) => setSelectedAnnee(e.target.value)}>
              <option value="">اختيار السنة</option>
              {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
               Add more years as needed 
            </select>
            <select
                className="form-select"
                style={{ width: '30%' }}
                value={selectedLaboratoire}
                onChange={(e) => setSelectedLaboratoire(e.target.value)}
              >
                <option value="">اختيار المختبر</option>
                {laboratoires.map(labo => (
                  <option key={labo.id} value={labo.id}>{labo.nom}</option>
                ))}
              </select>
              <select
                className="form-select"
                style={{ width: '30%' }}
                value={selectedEquipe}
                onChange={(e) => setSelectedEquipe(e.target.value)}
                disabled={!selectedLaboratoire} // Désactiver si aucun laboratoire n'est sélectionné
              >
                <option value="">اختيار الفريق</option>
                {equipes.map(equipe => (
                  <option key={equipe.id} value={equipe.id}>{equipe.nom}</option>
                ))}
              </select>
            <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={clearFilters}
              >
                افرغ
              </button>*/}


              



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
                {professeurs.map(professeur => (
                  <tr key={professeur.id}>
                    <td>{professeur.sum_number}</td>
                    <td>{professeur.name}</td>
                    <td>{professeur.first_name}</td>
                    <td>{professeur.name_ar}</td>
                    <td>{professeur.first_name_ar}</td>
                    <td>{professeur.email}</td>
                    <td>
                      <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteProfesseur(professeur.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModal"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModal(professeur)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
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
                <div className="form-group">
                  <label htmlFor="sum_number">Som</label>
                  <input type="text" className="form-control" id="sum_number" name="sum_number" value={newProfesseurData.sum_number} onChange={handleNewProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={newProfesseurData.name} onChange={handleNewProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">Prénom</label>
                  <input type="text" className="form-control" id="first_name" name="first_name" value={newProfesseurData.first_name} onChange={handleNewProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name_ar">Nom Ar</label>
                  <input type="text" className="form-control" id="name_ar" name="name_ar" value={newProfesseurData.name_ar} onChange={handleNewProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name_ar">Prénom Ar</label>
                  <input type="text" className="form-control" id="first_name_ar" name="first_name_ar" value={newProfesseurData.first_name_ar} onChange={handleNewProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={newProfesseurData.email} onChange={handleNewProfesseurDataChange} required />
                </div>
                {/*<div className="form-group text-right">
                  <label htmlFor="annee">السنة </label>
                  <select className="form-control" id="annee" name="annee"
                  onChange={handleNewUserDataChange}
                  value={newUserData.annee}
                  >
                          <option value="" disabled>اختر السنة</option>
                          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
                        </select>
                </div>*/}
                {/*<div className='form-group'>
                  <label htmlFor="user_id">صاحب المقال</label>
                  <select
                    className="form-control"
                    id="user_id"
                    name='user_id'
                    value={newUserData.user_id}
                    onChange={handleNewUserDataChange}
                    required
                  >
                    <option value="" disabled>اختر صاحب المقال</option>
                    {users.map(user => (
        <option key={user.id} value={user.id}>{user.nom} {user.prénom}</option>
      ))}
                    
                  </select>
                </div>*/}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-secondary" id="closeModalBtn" data-dismiss="modal">Annuler</button>
              <button type="button" style={{borderRadius: '0',
    padding: '3px 16px'}} className="btn btn-primary" onClick={addProfesseur}>Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
{editProfesseurData && ( 
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
                  <input type="text" className="form-control" id="sum_number" name="sum_number" value={editProfesseurData.sum_number} onChange={handleEditProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input type="text" className="form-control" id="name" name="name" value={editProfesseurData.name} onChange={handleEditProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name">Prénom</label>
                  <input type="text" className="form-control" id="first_name" name="first_name" value={editProfesseurData.first_name} onChange={handleEditProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="name_ar">Nom Ar</label>
                  <input type="text" className="form-control" id="name_ar" name="name_ar" value={editProfesseurData.name_ar} onChange={handleEditProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="first_name_ar">Prénom Ar</label>
                  <input type="text" className="form-control" id="first_name_ar" name="first_name_ar" value={editProfesseurData.first_name_ar} onChange={handleEditProfesseurDataChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="text" className="form-control" id="email" name="email" value={editProfesseurData.email} onChange={handleEditProfesseurDataChange} required />
                </div>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">Annuler</button>
          <button type="button" className="btn btn-primary" style={{borderRadius: '0',
    padding: '3px 16px'}} onClick={editProfesseur}>Modifier</button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Professeurs;
