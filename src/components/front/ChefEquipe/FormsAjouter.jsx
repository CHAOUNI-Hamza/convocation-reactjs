import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'
import { UserContext } from '../../../UserContext';

export default function FormsAjouter() {
    const [formVisible, setFormVisible] = useState('ajouterartcile');
    const [errorMessages, setErrorMessages] = useState({});
    const [articles, setArticles] = useState([]);
    const [books, setBooks] = useState([]);
    const [users, setUsersEquipe] = useState([]);
    const { userInfo } = useContext(UserContext);
    const handleSubmitArticle = (event) => {
        event.preventDefault();
        const titre = event.target.inputTitreArticle.value;
        const revue = event.target.inputRevue.value;
        const url = event.target.inputUrl.value;
        const annee = event.target.inputAnnee.value;
        const user_id = event.target.inputUser.value;
    
        const errors = validateArticleForm({ titre, revue, url, annee, user_id });
        if (Object.keys(errors).length > 0) {
          setErrorMessages(errors);
          return;
        }
    
        axios.post('admin/articles', { titre, revue, url, annee, user_id })
          .then(response => {
            setArticles([...articles, response.data]);
            event.target.reset();
            setErrorMessages({});
            alert()
          })
          .catch(error => {
            console.error('There was an error adding the article!', error);
          });
      };
      const fetchData = async () => {
        if(userInfo && userInfo.equipe_id) {
          // Recuperer tous les users d'une equipe specifique
          {/*axios.get(`/equipes/${userInfo.equipe_id}/users`)
            .then(response => {
              setUsersEquipe(response.data.data);
            })
            .catch(error => {
              console.error('There was an error fetching users equipe!', error);
            });*/}
        
      }
      };
    
      useEffect(() => {
        fetchData();
      }, [userInfo]);


      const handleSubmitBook = (event) => {
    
        event.preventDefault();
        const titre = event.target.inputTitreLivre.value;
        const isbn = event.target.inputIsbn.value;
        const depot_legal = event.target.inputDepotLegal.value;
        const annee = event.target.inputAnneeLivre.value;
        const issn = event.target.inputIssn.value;
        const user_id = event.target.inputUser.value;
    
        const errors = validateBookForm({ titre, isbn, depot_legal, annee, user_id });
        if (Object.keys(errors).length > 0) {
          setErrorMessages(errors);
          return;
        }
    
        axios.post('admin/livres', { titre, isbn, depot_legal, annee, issn, user_id })
          .then(response => {
            setBooks([...books, response.data]);
            event.target.reset();
            setErrorMessages({});
            alert()
          })
          .catch(error => {
            console.error('There was an error adding the book!', error);
          });
      };

      const validateArticleForm = ({ titre, revue, url, annee, user_id }) => {
        const errors = {};
        if (!titre) errors.titre = 'Veuillez entrer le titre';
        if (!revue) errors.revue = 'Veuillez entrer la revue';
        if (!url) errors.url = 'Veuillez entrer l\'URL';
        if (!annee) errors.annee = 'Veuillez entrer l\'année';
        if (!user_id) errors.user_id = 'Veuillez entrer user';
        return errors;
      };
    
      const validateBookForm = ({ titre, isbn, depot_legal, annee, user_id }) => {
        const errors = {};
        if (!titre) errors.titre = 'Veuillez entrer le titre';
        if (!isbn) errors.isbn = 'Veuillez entrer l\'ISBN';
        if (!depot_legal) errors.depot_legal = 'Veuillez entrer le dépôt légal';
        if (!user_id) errors.user_id = 'Veuillez entrer user';
        return errors;
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
          title: "Avec succès تمت بنجاح"
        });
      }
  

  return (
    <div className="col-xl-8">
              <div className="card mb-4">
                <div className="card-header">
                  <button
                    className={`btn btn-ajouter ${formVisible === 'ajouterartcile' ? 'active' : ''}`}
                    onClick={() => setFormVisible('ajouterartcile')}
                  >
                    Ajouter Article
                  </button>
                  <button
                    className={`btn btn-ajouter ${formVisible === 'ajouterlivre' ? 'active' : ''}`}
                    onClick={() => setFormVisible('ajouterlivre')}
                  >
                    Ajouter Livre
                  </button>
                  <button
                    className={`btn btn-ajouter fontar ${formVisible === 'ajouterartcilear' ? 'active' : ''}`}
                    onClick={() => setFormVisible('ajouterartcilear')}
                  >
                    إضافة مقال
                  </button>
                  <button
                    className={`btn btn-ajouter fontar ${formVisible === 'ajouterlivrear' ? 'active' : ''}`}
                    onClick={() => setFormVisible('ajouterlivrear')}
                  >
                    إضافة كتاب
                  </button>
                </div>
                <div className="card-body">
                  {formVisible === 'ajouterartcile' ? (
                    <form onSubmit={handleSubmitArticle}>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputTitreArticle">Titre</label>
                        <input className="form-control text-left" id="inputTitreArticle" type="text" placeholder="Entrez le titre" />
                        {errorMessages.titre && <div className="text-danger">{errorMessages.titre}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputRevue">Revue</label>
                        <input className="form-control text-left" id="inputRevue" type="text" placeholder="Entrez dans la revue" />
                        {errorMessages.revue && <div className="text-danger">{errorMessages.revue}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputUrl">URL</label>
                        <input className="form-control text-left" id="inputUrl" type="text" placeholder="Entrez l'URL" />
                        {errorMessages.url && <div className="text-danger">{errorMessages.url}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputAnnee">Année</label>
                        <select className="form-control text-left" id="inputAnnee">
                          <option value="">Sélectionnez l'année</option>
                          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
                        </select>
                        {errorMessages.annee && <div className="text-danger">{errorMessages.annee}</div>}
                      </div>
                        <div className='mb-3'>
                        <label className="small mb-1" htmlFor="inputUser">L'auteur de l'article</label>
                        <select
                        id="inputUser"
                        className="form-control text-left"
                        name="user_id"
                         // Set the default value to the authenticated user's ID
                        required
                      >
                        {/* Check if userInfo is defined before using it */}
                        {userInfo ? (
        <option key={userInfo.id} value={userInfo.id}>
          {userInfo.nom} {userInfo.prénom}
        </option>
      ) : (
        <option value="" disabled>Loading...</option>
      )}
      
      {users
        .filter(user => user.id !== userInfo.id) // Exclure userInfo de la liste
        .map(user => (
          <option key={user.id} value={user.id}>
            {user.nom} {user.prénom}
          </option>
        ))}
      
                      </select>
      
      
                      </div>
                      
                      <button className="btn btn-primary" type="submit"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg> Ajouter
                      </button>
                    </form>
                  ) :
                  formVisible === 'ajouterlivre' ? (
                    <form onSubmit={handleSubmitBook}>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputTitreLivre">Titre</label>
                        <input className="form-control text-left" id="inputTitreLivre" type="text" placeholder="Entrez le titre" />
                        {errorMessages.titre && <div className="text-danger">{errorMessages.titre}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputIsbn">ISBN</label>
                        <input className="form-control text-left" id="inputIsbn" type="text" placeholder="Entrez l'ISBN" />
                        {errorMessages.isbn && <div className="text-danger">{errorMessages.isbn}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputDepotLegal">Dépot Légal</label>
                        <input className="form-control text-left" id="inputDepotLegal" type="text" placeholder="Entrez le dépôt légal" />
                        {errorMessages.depot_legal && <div className="text-danger">{errorMessages.depot_legal}</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputIssn">ISSN</label>
                        <input className="form-control text-left" id="inputIssn" type="text" placeholder="Entrez l'ISSN" />
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputAnneeLivre">Année</label>
                        <select className="form-control text-left" id="inputAnneeLivre">
                          <option value="">Sélectionnez l'année</option>
                          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
                        </select>
                        {errorMessages.annee && <div className="text-danger">{errorMessages.annee}</div>}
                      </div>
                      <div className='mb-3'>
                  <label className="small mb-1" htmlFor="inputUser">L'auteur de livre</label>
                  <select
                  id="inputUser"
                  className="form-control text-left"
                  name="user_id"
                   // Set the default value to the authenticated user's ID
                  required
                >
                  {userInfo ? (
  <option key={userInfo.id} value={userInfo.id}>
    {userInfo.nom} {userInfo.prénom}
  </option>
) : (
  <option value="" disabled>Loading...</option>
)}

{users
  .filter(user => user.id !== userInfo.id) // Exclure userInfo de la liste
  .map(user => (
    <option key={user.id} value={user.id}>
      {user.nom} {user.prénom}
    </option>
  ))}

                </select>
                </div>
                      <button className="btn btn-primary" type="submit"> 
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg> Ajouter
                      </button>
                    </form>
                  ) :
                  formVisible === 'ajouterartcilear' ?(
                    <form onSubmit={handleSubmitArticle} className='text-right'>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputTitreArticle">العنوان</label>
                        <input className="form-control text-right" id="inputTitreArticle" type="text" placeholder="العنوان" />
                        {errorMessages.titre && <div className="text-danger">الرجاء إدخال العنوان</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputRevue">المجلة</label>
                        <input className="form-control text-right" id="inputRevue" type="text" placeholder="المجلة" />
                        {errorMessages.revue && <div className="text-danger">الرجاء إدخال المجلة</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputUrl">الرابط</label>
                        <input className="form-control text-right" id="inputUrl" type="text" placeholder="الرابط" />
                        {errorMessages.url && <div className="text-danger">الرجاء إدخال الرابط</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputAnnee">السنة</label>
                        <select className="form-control text-right" id="inputAnnee">
  <option value="">إختر السنة</option>
  {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
</select>

                        {errorMessages.annee && <div className="text-danger">الرجاء إدخال السنة</div>}
                      </div>
                      <div className='mb-3'>
                  <label className="small mb-1" htmlFor="inputUser">صاحب المقال</label>
                  <select
                  id="inputUser"
                  className="form-control"
                  name="user_id"
                   // Set the default value to the authenticated user's ID
                  required
                >
                  {userInfo ? (
  <option key={userInfo.id} value={userInfo.id}>
    {userInfo.nom} {userInfo.prénom}
  </option>
) : (
  <option value="" disabled>Loading...</option>
)}

{users
  .filter(user => user.id !== userInfo.id) // Exclure userInfo de la liste
  .map(user => (
    <option key={user.id} value={user.id}>
      {user.nom} {user.prénom}
    </option>
  ))}

                </select>
                </div>
                      <button className="btn btn-primary" type="submit"> إضافة
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg> 
                      </button>
                    </form>
                  ) : formVisible === 'ajouterlivrear' ?(
                    <form onSubmit={handleSubmitBook} className='text-right'>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputTitreLivre">العنوان</label>
                        <input className="form-control text-right" id="inputTitreLivre" type="text" placeholder="العنوان" />
                        {errorMessages.titre && <div className="text-danger">الرجاء إدخال العنوان</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputIsbn">ر.د.م.ك</label>
                        <input className="form-control text-right" id="inputIsbn" type="text" placeholder="ر.د.م.ك" />
                        {errorMessages.isbn && <div className="text-danger">الرجاء إدخال ر.د.م.ك</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputDepotLegal">الإيداع القانوني</label>
                        <input className="form-control text-right" id="inputDepotLegal" type="text" placeholder="الإيداع القانون" />
                        {errorMessages.depot_legal && <div className="text-danger">الرجاء إدخال الإيداع القانون</div>}
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputIssn">ISSN</label>
                        <input className="form-control text-right" id="inputIssn" type="text" placeholder="إ.س.س.ن" />
                      </div>
                      <div className="mb-3">
                        <label className="small mb-1" htmlFor="inputAnneeLivre">السنة</label>
                        <select className="form-control text-right" id="inputAnneeLivre">
                          <option value="">إختر السنة</option>
                          {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => 2000 + i).reverse().map(year => (
    <option key={year} value={year}>{year}</option>
  ))}
                        </select>
                        {errorMessages.annee && <div className="text-danger">الرجاء إدخال السنة</div>}
                      </div>
                      <div className='mb-3'>
                  <label className="small mb-1" htmlFor="inputUser">صاحب الكتاب</label>
                  <select
                  id="inputUser"
                  className="form-control"
                  name="user_id"
                   // Set the default value to the authenticated user's ID
                  required
                >
                  {userInfo ? (
  <option key={userInfo.id} value={userInfo.id}>
    {userInfo.nom} {userInfo.prénom}
  </option>
) : (
  <option value="" disabled>Loading...</option>
)}

{users
  .filter(user => user.id !== userInfo.id) // Exclure userInfo de la liste
  .map(user => (
    <option key={user.id} value={user.id}>
      {user.nom} {user.prénom}
    </option>
  ))}

                </select>
                </div>
                      <button className="btn btn-primary" type="submit"> إضافة
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                        </svg> 
                      </button>
                    </form>
                  ) : null }
                </div>
              </div>
            </div>
  );
}
