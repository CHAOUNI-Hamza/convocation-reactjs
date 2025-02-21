import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import coverHeader from '../../assets/cover-header-avec-logo-40ans-05.jpg';
import CardProfil from '../../components/front/ChefEquipe/CardProfil';    
import FormsAjouter from '../../components/front/Prof/FormsAjouter';
import Articles from '../../components/front/Prof/Articles';
import Livres from '../../components/front/Prof/Livres';
import '../../css/home.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export default function HomeView({handleLogout}) {
  const { userInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('profil');
  //const [userInfo, setUserInfo] = useState({});
  const [articles, setArticles] = useState([]);
  const [books, setBooks] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch authenticated user information
    /*axios.post('/auth/me')
      .then(response => {
        setUserInfo(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching user data!', error);
      });*/

    // Fetch user's articles
    if(userInfo) {
      axios.get('/art')
      .then(response => {
        setArticles(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching articles!', error);
      });

    // Fetch user's books
    axios.get('/liv')
      .then(response => {
        setBooks(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching books!', error);
      });
    }
    
  }, [userInfo]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          
          <div className="row">
            <CardProfil handleLogout={handleLogout}/>
            <FormsAjouter />
          </div>
        );
      case 'artciles':
        return <Articles />;
      case 'livres':
        return <Livres />;
      case 'notifications':
        return <div>Notifications content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container-xl px-4 mt-4 home">
      <div className='top-bar'>
        <img src={coverHeader} alt="Cover Header" width="100%" />
      </div>


      <div className='title-labo-liv pt-3 pb-3' style={{ background: '#248ecb24',
    borderRadius: '13px',
    marginTop: '16px' }}>
        <div className='row justify-content-center'>
          <div className='col-md-6 text-center' style={{fontSize: 'larger',
    fontWeight: '300'}}><span style={{fontWeight: '500',
    color: 'cadetblue',
    fontSize: 'x-large',
    fontFamily: 'system-ui'}}>Laboratoire :</span> {userInfo?.laboratoire || 'N/A'}</div>
          <div className='col-md-6 text-center' style={{fontSize: 'larger',
    fontWeight: '300'}}><span style={{fontWeight: '500',
    color: 'cadetblue',
    fontSize: 'x-large',
    fontFamily: 'system-ui'}}>Equipe :</span> {userInfo?.equipe || 'N/A'}</div>
        </div>
      </div>

      
      <nav className="nav nav-borders mt-3">
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>Profil</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'artciles' ? 'active' : ''}`} onClick={() => setActiveTab('artciles')}>Articles</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'livres' ? 'active' : ''}`} onClick={() => setActiveTab('livres')}>Livres</a>
      </nav>
      <hr className="mt-0 mb-4" />
      {renderContent()}
    </div>
  );
}
