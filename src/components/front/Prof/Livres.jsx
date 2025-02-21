import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { UserContext } from '../../../UserContext';

export default function Articles() {
    const { userInfo } = useContext(UserContext);
    const [livresTab, setLivresTab] = useState('mesLivres');
    const [books, setBooks] = useState([]);
    const [users, setUsersEquipe] = useState([]);
    const [editLivData, setEditLivData] = useState(null);

    const fetchData = async () => {
        if(userInfo) {
          axios.get('/liv')
        .then(response => {
          setBooks(response.data.data);
        })
        .catch(error => {
          console.error('There was an error fetching books!', error);
        });
      }
      };

  useEffect(() => {
    fetchData();
}, [userInfo])
    const handleEditLivDataChange = (e) => {
        const { name, value } = e.target;
        setEditLivData({ ...editLivData, [name]: value });
      };
      const editLiv = async () => {
        try {
          const { id, titre, isbn, depot_legal, issn, annee } =
            editLivData;
          await axios.put(`/livres/${id}`, {
            titre,
            isbn,
            depot_legal,
            issn,
            annee,
          });
          fetchData();
          Swal.fire({
            title: "تم",
            text: "تم تحديث المعلومات بنجاح.",
            icon: "success",
          }).then(() => {
            document.getElementById("closeEditModalBtn").click();
          });
        } catch (error) {
          if (error.response && error.response.data.errorDate) {
            Swal.fire({
              icon: "error",
              title: "خطأ",
              text: error.response.data.errorDate,
            });
          } else {
            console.error("Error updating user:", error);
          }
        }
      };
      const deleteLiv = async (id) => {
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
            await axios.delete(`/livres/${id}`);
            fetchData();
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
      const openEditModalLiv = (user) => {
        setEditLivData(user);
      };

  return (
    <div className='row'>
            {books.map(book => (
              <div className='col-12 col-md-6 mb-4' key={book.id}>
                <div className="card">
                  <div className="card-body" style={{height: '223px'}}>
                    <h6 className="card-title" style={{display: 'contents'}}>{book.titre}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary"> <span style={{ fontWeight: 'bold' }}>Année :</span>  {book.annee}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary"> <span style={{ fontWeight: 'bold' }}>ISBN :</span>  {book.isbn}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary"> <span style={{ fontWeight: 'bold' }}>Dépôt légal :</span>  {book.depot_legal}</h6>
                    <h6 className="card-subtitle mb-2 mt-2 text-body-secondary"> <span style={{ fontWeight: 'bold' }}>ISSN :</span>  {book.issn}</h6>
                    <div className='actions mt-2'>
            <a
                        href="#"
                        style={{ color: '#ff0000b3', marginRight: '10px' }}
                        aria-label="Delete"
                        onClick={() => deleteLiv(book.id)}
                      >
                        <i className="fa fa-trash" aria-hidden="true"></i>
                      </a>
                      <a
                        type='button'
                        data-toggle="modal"
                        data-target="#editModalLiv"
                        style={{ color: '#007bff', marginRight: '10px' }}
                        aria-label="Edit"
                        onClick={() => openEditModalLiv(book)}
                      >
                        <i className="fa fa-edit" aria-hidden="true"></i>
                      </a>
            </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Edit Liv Modal */}
{editLivData && ( 
  <div className="modal fade" id="editModalLiv" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header" dir='rtl'>
          <h5 className="modal-title font-arabic" id="editModalLabel">  تعديل </h5>
        </div>
        <div className="modal-body" dir='rtl'>
          <form>
                <div className="form-group text-right">
                  <label htmlFor="edtitre">العنوان</label>
                  <input type="text" className="form-control" id="edtitre" name="titre" value={editLivData.titre} onChange={handleEditLivDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="edisbn">ISBN </label>
                  <input type="text" className="form-control" id="edisbn" name="isbn" value={editLivData.isbn} onChange={handleEditLivDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="eddepot_legal">الإيداع القانوني </label>
                  <input type="text" className="form-control" id="eddepot_legal" name="depot_legal" value={editLivData.depot_legal} onChange={handleEditLivDataChange} required />
                </div>
                <div className="form-group text-right">
                  <label htmlFor="edissn">ISSN </label>
                  <input type="text" className="form-control" id="edissn" name="issn" value={editLivData.issn} onChange={handleEditLivDataChange} required />
                </div>


                <div className="form-group text-right">
  <label htmlFor="annee">السنة </label>
  <select
    className="form-control"
    id="annee"
    name="annee"
    value={editLivData.annee}
    onChange={handleEditLivDataChange}
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
          <button type="button" className="btn btn-primary" onClick={editLiv}>تعديل</button>
        </div>
      </div>
    </div>
  </div>
)}
          </div>
  );
}
