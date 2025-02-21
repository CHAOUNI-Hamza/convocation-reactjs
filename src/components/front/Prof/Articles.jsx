import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { UserContext } from '../../../UserContext';

export default function Articles() {
    const { userInfo } = useContext(UserContext);
    const [articles, setArticles] = useState([]);
    const [users, setUsersEquipe] = useState([]);
    const [editArtData, setEditArtData] = useState(null);
    const fetchArticles = async () => {
      if (userInfo) {
          try {
              const response = await axios.get('/art');
              setArticles(response.data.data);
          } catch (error) {
              console.error('There was an error fetching articles!', error);
          }
      }
  };

  useEffect(() => {
      fetchArticles();
  }, [userInfo]);
    const handleEditArtDataChange = (e) => {
        const { name, value } = e.target;
        setEditArtData((editArtData) => ({ ...editArtData, [name]: value }));
      };


      const deleteArt = async (id) => {
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
            await axios.delete(`/articles/${id}`);
            fetchArticles();
            Swal.fire({
              title: "تم الحذف!",
              text: "تم الحذف بنجاح.",
              icon: "success"
            });
          }
        } catch (error) {
          console.error('Error deleting user:', error);
        }
      };

      const openEditModalArt = (user) => {
        setEditArtData(user);
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
        }
      };
      const editArt = async () => {
        try {
          const { id, titre, revue, url, annee } = editArtData;
          await axios.put(`articles/${id}`, { titre, revue, url, annee });
          fetchArticles()
          Swal.fire({
            title: "تم",
            text: "تم التحديث بنجاح.",
            icon: "success"
          }).then(() => {
            document.getElementById('closeEditModalBtn').click();
          });
        } catch (error) {
          handleApiError(error, 'حدث خطأ أثناء تحديث المعلومات .');
        }
      };
      

  return (
    <div className='row'>
            {articles.map(article => (
              <div className='col-12 col-md-6 mb-4' key={article.id}>
                <div className="card">
                  <div className="card-body" style={{height: '180px'}}>
                    <h6 className="card-title" style={{display: 'contents'}}>{article.titre}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary">Année : {article.annee}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary">Revue : {article.revue}</h6>
                    <a href={article.url} className="card-link url">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link-45deg" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                      </svg>
                      URL
            </a>
            <div className='actions mt-2'>
            <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteArt(article.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModalArt"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModalArt(article)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
            </div>
                  </div>
                </div>
              </div>
            ))}


            {/* Edit article */}
      {editArtData && ( 
  <div className="modal fade" id="editModalArt" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel"> تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
          <div className="form-group text-right">
                  <label htmlFor="titre">العنوان</label>
                  <input type="text" className="form-control" id="titre" name="titre" value={editArtData.titre} onChange={handleEditArtDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="revue">المجلة </label>
                  <input type="text" className="form-control" id="revue" name="revue" value={editArtData.revue} onChange={handleEditArtDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="url">الرابط </label>
                  <input type="text" className="form-control" id="url" name="url" value={editArtData.url} onChange={handleEditArtDataChange} required />
                </div>
                <div className="form-group text-right">
  <label htmlFor="annee">السنة </label>
  <select
    className="form-control"
    id="annee"
    name="annee"
    value={editArtData.annee}
    onChange={handleEditArtDataChange}
  >
    {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
  </select>
</div>

          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" style={{borderRadius: '0',
    padding: '3px 16px'}} id="closeEditModalBtn" data-dismiss="modal">إلغاء</button>
          <button type="button" className="btn btn-primary" onClick={editArt}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}
          </div>
  );
}
