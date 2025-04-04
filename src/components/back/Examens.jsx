import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../css/global.css';

function Examens() {
  const [datas, setDatas] = useState([]);
  const [professeursCache, setProfesseursCache] = useState({}); // Cache pour les professeurs
  const [error, setError] = useState(null);
  const [showInputs, setShowInputs] = useState(false);
  const [selectedExams, setSelectedExams] = useState([{ exams: [] }]);
  const [editData, setEditData] = useState(null);

  const fetchProfesseursDisponibles = async (date, creneau_horaire) => {
    const key = `${date}-${creneau_horaire}`; // Générer une clé unique pour chaque combinaison date + créneau
    if (professeursCache[key]) {
      return professeursCache[key]; // Si déjà en cache, retourner les données
    }
    try {
      const response = await axios.get('/professeurs-disponibles', {
        params: { date, creneau_horaire }
      });
      const professeurs = response.data.data;
      setProfesseursCache((prevCache) => ({ ...prevCache, [key]: professeurs })); // Mettre à jour le cache
      return professeurs;
    } catch (error) {
      console.error("Erreur lors de la récupération des enseignants", error);
      return [];
    }
  };
  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get('/exams');
      const examens = response.data.data;
      const updatedExamens = await Promise.all(
        examens.map(async (exam) => {
          const profs = await fetchProfesseursDisponibles(exam.date, exam.creneau_horaire);
          return { ...exam, available_teachers: profs };
        })
      );
      setDatas(updatedExamens);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
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
  const handleEditDataChange = (e) => {
    const { name, value } = e.target;
    setEditData((editData) => ({ ...editData, [name]: value }));
  };
  const validateForm = ({ date, creneau_horaire}) => {
    if (!date || !creneau_horaire ) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Veuillez remplir tous les champs obligatoires !',
      });
      return false;
    }
    return true;
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

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="row">
      {datas.length > 0 ? (
      <div className="col-12">
        <div className="card">
          <div className="card-header p-3" style={{ textAlign: 'right' }}>
          <h3 className="card-title p-2" style={{ borderBottom: 'none', paddingBottom: '0', fontSize: 'x-large' }}> Liste des examens</h3>
          </div>
          
  <div className="card-body table-responsive p-0">
  <table className="table table-hover text-nowrap">
    <thead>
      <tr>
        <th>Date</th>
        <th>Créneau horaire</th>
        <th>Professeurs</th>
      </tr>
    </thead>
    <tbody>
      {datas.map(data => (
        <tr key={data.id}>
          <td>{data.date}</td>
          <td>{data.creneau_horaire.slice(0, 5)}</td>
          <td>
            {data.teachers && data.teachers.length > 0
            ? data.teachers.map((teacher, index) => (
                <React.Fragment key={index}>
                  <span>{teacher.name}</span>
                  <span className="ml-2 badge badge-primary">
                  {teacher.total_exams}
                  </span>
                  <a
                    onClick={() => openShowModal(teacher.id)}
                    data-toggle="modal"
                    data-target="#showModal"
                    style={{ cursor: 'pointer' }}
                  ><i className="ml-2 fa fa-eye text-success" aria-hidden="true"></i></a>
                  <br />
                </React.Fragment>
              ))
            : 'Aucun'}
          </td>
          <td>
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
  </table>
  {error && (
    <div className="alert alert-danger" role="alert">
      {error}
    </div>
  )}
</div>
        </div>
      </div>
      ) : (
        <p>Aucune donnée disponible.</p>
      )}
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
                          &nbsp;&nbsp;-&nbsp;&nbsp;
                          {teacher.total_exams}
                          &nbsp;&nbsp;-&nbsp;&nbsp;
                          {teacher.city}
                          &nbsp;&nbsp;-&nbsp;&nbsp;
                          {teacher.limit}
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
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" style={{borderRadius: '0', padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">Annuler</button>
                <button type="button" className="btn btn-primary" style={{borderRadius: '0', padding: '3px 16px'}} onClick={updateData}>Modifier</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Examens;
