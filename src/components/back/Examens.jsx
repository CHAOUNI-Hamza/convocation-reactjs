import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import '../../css/global.css';

function Examens() {
  const [datas, setDatas] = useState([]);
  const [error, setError] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedExams, setSelectedExams] = useState([{ exams: [] }]);
  const [editData, setEditData] = useState(null);
  const [date, setDate] = useState('');
  const [module, setModule] = useState('');
  const [salle, setSalle] = useState('');
  const [filiere, setFiliere] = useState('');
  const [semestre, setSemestre] = useState('');
  const [groupe, setGroupe] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newData, setNewData] = useState({
         date: '',
          creneau_horaire: '',
          module: '',
          salle: '',
          filiere: '',
          semestre: '',
          groupe: '',
          lib_mod: '',
          teacher_ids: [],
  });
  const fetchData = async (page = 1) => {
    try {
      const params = {
        page,
        date,
        module,
        salle,
        filiere,
        semestre,
        groupe,
      };
      const response = await axios.get('/exams', { params });
      const examens = response.data.data;
      const updatedExamens = await Promise.all(
        examens.map(async (exam) => {
          const profs = await fetchProfesseursDisponibles(exam.date, exam.creneau_horaire);
          return { ...exam, available_teachers: profs };
        })
      );
      setDatas(updatedExamens);
      setCurrentPage(page);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setError("Une erreur s'est produite lors du chargement des données.");
    }
  };
  const fetchProfesseursDisponibles = async (date, creneau_horaire) => {
    try {
      const response = await axios.get('/professeurs-disponibles', {
        params: { date, creneau_horaire }
      });
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants", error);
      return [];
    }
  };
  const fetchTeachers = async () => {
    try {
      const response = await axios.get('/teachers/all'); 
      setTeachers(response.data.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants", error);
    }
  };
  const fetchAllDataForExcel = async () => {
    try {
      const response = await axios.get('/exams/all');
      return response.data.data;
    } catch (error) {
      console.error("Erreur lors de la récupération de toutes les données :", error);
      setError("Une erreur s'est produite lors du chargement des données.");
    }
  };
  const openShowModal = async (professeur) => {
    try {
      const response = await axios.get(`/professeurs/${professeur}/exams`);
      setSelectedExams(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des examens :", error);
      setSelectedExams([]);
    }
  };
  const handleNewDataChange = (e) => {
    const { name, value } = e.target;
    setNewData((newData) => ({ ...newData, [name]: value }));
  };
  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditData((editData) => ({ ...editData, [name]: value }));
  };
  const validateForm = ({ date, creneau_horaire, module, salle, filiere, semestre, groupe , lib_mod, teacher_ids}) => {
    if (!date || !creneau_horaire || !module || !salle || !filiere || !semestre || !groupe || !lib_mod || !teacher_ids) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires !',
      });
      return false;
    }
    return true;
  };
  const addData = async () => {
    if (!validateForm(newData)) return;
    try {
      const payload = {
        ...newData,
        teacher_ids: Array.isArray(newData.teacher_ids) ? newData.teacher_ids : [newData.teacher_ids],
      };
      await axios.post('/exams', payload);
      Swal.fire({
        title: "Ok",
        text: "Ajouté avec succès.",
        icon: "success"
      }).then(() => {
        document.getElementById('closeModalBtn').click();
        setNewData({
          date: '',
          creneau_horaire: '',
          module: '',
          salle: '',
          filiere: '',
          semestre: '',
          groupe: '',
          lib_mod: '',
          teacher_ids: [],
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
      await axios.put(`exams/${editData.id}`, {
        ...editData,
        teacher_ids: Array.isArray(editData.teacher_ids) ? editData.teacher_ids : [editData.teacher_ids]
      });
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
        await axios.delete(`/exams/${id}`);
        fetchData();
        Swal.fire({
          title: "Supprimé !",
          text: "Supprimé avec succès.",
          icon: "success"
        });
      }
    } catch (error) {
      console.error('Error deleting Professeur:', error);
      setError("Une erreur s'est produite lors de la suppression.");
    }
  };
  const openEditModal = (professeur) => {
    setEditData(professeur);
  };
  const handleApiError = (error, defaultMessage) => {
    if (error.response && error.response.data.errorDate) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: error.response.data.errorDate,
      });
    } else {
      console.error(defaultMessage, error);
      setError(defaultMessage);
    }
  };
  const convertToExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data.map(exam => ({
    'module': exam.module,
    'semestre': exam.semestre,
    'date': exam.date,
    'creneau_horaire': exam.creneau_horaire,
    'groupe': exam.groupe,
    'salle': exam.salle,
    'lib_mod': exam.lib_mod,
    'filiere': exam.filiere,
  })));
  const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'exams');
    return wb;
  };
  const downloadExcel = async () => {
    const allData = await fetchAllDataForExcel();  // Récupérer toutes les données pour l'export
    const wb = convertToExcel(allData);  // Convertir ces données en Excel
    XLSX.writeFile(wb, 'exams.xlsx');  // Télécharger le fichier Excel
  };
  useEffect(() => {
    fetchData();
    fetchAllDataForExcel();
    fetchTeachers();
  }, []);
  const clearFilters = () => {
    fetchData(); setDate(''); setModule(''); setSalle(''); setFiliere(''); setSemestre(''); setGroupe('');
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
    paddingBottom: '0' }}> Liste des examens</h3>
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
      <div className="filter-group">
        <div className='form-group d-flex'>
          <input type="date" className='form-control mr-2' value={date} onChange={(e) => setDate(e.target.value)} placeholder="Filtrer par date"/>
          <input type="text" className='form-control mr-2' value={module} onChange={(e) => setModule(e.target.value)} placeholder="Filtrer par module"
          />
          <input type="text" className='form-control mr-2' value={salle} onChange={(e) => setSalle(e.target.value)} placeholder="Filtrer par salle"
          />
          <input type="text" className='form-control mr-2' value={filiere} onChange={(e) => setFiliere(e.target.value)} placeholder="Filtrer par filière"
          />
          <input type="text" className='form-control mr-2' value={semestre} onChange={(e) => setSemestre(e.target.value)} placeholder="Filtrer par semestre"
          />
          <input type="text" className='form-control mr-2' value={groupe} onChange={(e) => setGroupe(e.target.value)} placeholder="Filtrer par groupe"
          />
          <button className='btn btn-primary mr-2' onClick={() => fetchData(1)}>Filtrer</button>
          <button className='btn btn-danger' onClick={clearFilters}>Réinitialiser</button>
        </div>
      </div>
    </div>
          </div>
          <div className="card-body table-responsive p-0">
            <table className="table table-hover text-nowrap">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Créneau horaire</th>
                  <th>Module</th>
                  <th>Salle</th>
                  <th>Filière</th>
                  <th>Semestre</th>
                  <th>Groupe</th>
                  <th>Libellé module</th>
                  <th>Professeurs</th>
                </tr>
              </thead>
              <tbody>
                {datas.map(data => (
                  <tr key={data.id}>
                    <td>{data.date}</td>
                    <td>{data.creneau_horaire.slice(0, 5)}</td>
                    <td>{data.module}</td>
                    <td>{data.salle}</td>
                    <td>{data.filiere}</td>
                    <td>{data.semestre}</td>
                    <td>{data.groupe}</td>
                    <td>{data.lib_mod}</td>
                    <td>
        {data.teachers && data.teachers.length > 0
          ? data.teachers.map((teacher, index) => (
              <React.Fragment key={index}>
                  <span>{teacher.name}</span>
                  <span class="ml-2 badge badge-primary">
                  {teacher.total_exams}
                  </span>
                  <a
                  onClick={() => openShowModal(teacher.id)}
                  data-toggle="modal"
                  data-target="#showModal"
                  ><i class="ml-2 fa fa-eye text-success" aria-hidden="true"></i></a>
                <br />
              </React.Fragment>
            ))
          : 'Aucun'}
      </td>
                    <td>
                      {/*<a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteData(data.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>*/}
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
    <label htmlFor="date">Date</label>
    <input type="date" className="form-control" id="date" name="date" value={newData.date} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
  <label htmlFor="creneau_horaire">Créneau horaire</label>
  <select
    className="form-control"
    id="creneau_horaire"
    name="creneau_horaire"
    value={newData.creneau_horaire}
    onChange={handleNewDataChange}
    required
  >
    <option value="09:00">09:00</option>
    <option value="11:30">11:30</option>
    <option value="14:00">14:00</option>
    <option value="14:30">14:30</option>
    <option value="16:30">16:30</option>
    <option value="17:00">17:00</option>
  </select>
</div>
  <div className="form-group">
    <label htmlFor="module">Module</label>
    <input type="text" className="form-control" id="module" name="module" value={newData.module} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="salle">Salle</label>
    <input type="text" className="form-control" id="salle" name="salle" value={newData.salle} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="filiere">Filière</label>
    <input type="text" className="form-control" id="filiere" name="filiere" value={newData.filiere} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="semestre">Semestre</label>
    <input type="text" className="form-control" id="semestre" name="semestre" value={newData.semestre} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="groupe">Groupe</label>
    <input type="text" className="form-control" id="groupe" name="groupe" value={newData.groupe} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
    <label htmlFor="lib_mod">Libellé du Module</label>
    <input type="text" className="form-control" id="lib_mod" name="lib_mod" value={newData.lib_mod} onChange={handleNewDataChange} required />
  </div>
  <div className="form-group">
  <label htmlFor="teacher_ids">Professeurs</label>
  <select
    className="form-control"
    id="teacher_ids"
    name="teacher_ids"
    multiple
    value={newData.teacher_ids || []}
    onChange={(e) =>
      setNewData({ ...newData, teacher_ids: [...e.target.selectedOptions].map(o => o.value) })
    }
    required
    size="5"
  >
    <option value="" className='text-red'>-- Aucun professeur --</option>
    {teachers.map((teacher) => (
      <option key={teacher.id} value={teacher.id}>
        {teacher.name}
        &nbsp;&nbsp;
                  {teacher.total_exams}
      </option>
    ))}
  </select>
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
  <label htmlFor="teacher_ids">Professeurs</label>
  <select
  className="form-control"
  id="teacher_ids"
  name="teacher_ids"
  multiple
  value={editData.teacher_ids || []}
  onChange={(e) =>
    setEditData({ ...editData, teacher_ids: [...e.target.selectedOptions].map(o => o.value) })
  }
  required
  size="20"
>
<option value="" className='text-red'>-- Aucun professeur --</option>
                {editData.available_teachers && editData.available_teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                    &nbsp;&nbsp;
                  {teacher.total_exams}
                  </option>
    ))}
  </select>
</div>
<button
              type="button"
              className="btn btn-info text-white mb-2"
              style={{ borderRadius: "0", padding: "3px 16px" }}
              onClick={() => setShowInputs(!showInputs)}
            >
              {showInputs ? "Masquer les champs" : "Afficher les champs"}
            </button>
{showInputs && (
                <>
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input type="date" className="form-control" id="date" name="date" value={editData.date} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="creneau_horaire">Créneau horaire</label>
        <select
          className="form-control"
          id="creneau_horaire"
          name="creneau_horaire"
          value={editData.creneau_horaire}
          onChange={handleEditDataChange}
          required
        >
          <option value="09:00:00">09:00</option>
          <option value="11:30:00">11:30</option>
          <option value="14:00:00">14:00</option>
          <option value="14:30:00">14:30</option>
          <option value="16:30:00">16:30</option>
          <option value="17:00:00">17:00</option>
        </select>
      </div>


      <div className="form-group">
        <label htmlFor="module">Module</label>
        <input type="text" className="form-control" id="module" name="module" value={editData.module} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="salle">Salle</label>
        <input type="text" className="form-control" id="salle" name="salle" value={editData.salle} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="filiere">Filière</label>
        <input type="text" className="form-control" id="filiere" name="filiere" value={editData.filiere} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="semestre">Semestre</label>
        <input type="text" className="form-control" id="semestre" name="semestre" value={editData.semestre} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="groupe">Groupe</label>
        <input type="text" className="form-control" id="groupe" name="groupe" value={editData.groupe} onChange={handleEditDataChange} required />
      </div>

      <div className="form-group">
        <label htmlFor="lib_mod">Libellé du Module</label>
        <input type="text" className="form-control" id="lib_mod" name="lib_mod" value={editData.lib_mod} onChange={handleEditDataChange} required />
      </div>
      </>
              )}
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
<div className="modal fade" id="showModal" tabIndex="-1" role="dialog" aria-labelledby="showModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-lg" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title font-arabic" id="showModalLabel">{ selectedExams.first_name } { selectedExams.name }</h5>
      </div>
      <div className="modal-body">
      {selectedExams?.exams?.length > 0 ? (
  <table className="table">
    <thead>
      <tr>
        <th>Module</th>
        <th>Semestre</th>
        <th>Date</th>
        <th>Créneau Horaire</th>
        <th>Groupe</th>
      </tr>
    </thead>
    <tbody>
      {selectedExams.exams.map((exam) => (
        <tr key={exam.id}>
          <td>{exam.module}</td>
          <td>{exam.semestre}</td>
          <td>{exam.date}</td>
          <td>{exam.creneau_horaire.slice(0, 5)}</td>
          <td>{exam.groupe}</td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <p>Aucun examen trouvé pour ce professeur.</p>
)}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Fermer</button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
export default Examens;
