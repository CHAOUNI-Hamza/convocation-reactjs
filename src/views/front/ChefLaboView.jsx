import React, { useContext, useState } from 'react';
import coverHeader from '../../assets/cover-header-avec-logo-40ans-05.jpg';
import '../../css/home.css';
import '../../css/chef-equipe.css';
import { UserContext } from '../../UserContext';
import CardTop from '../../components/front/ChefLabo/CardTop';
import CardProfil from '../../components/front/ChefEquipe/CardProfil';
import FormsAjouter from '../../components/front/ChefLabo/FormsAjouter';
import Articles from '../../components/front/ChefLabo/Articles';
import Livres from '../../components/front/ChefLabo/Livres';
import Users from '../../components/front/ChefLabo/Users';
import ArticlesByUser from '../../components/front/ChefLabo/ArticlesByUser';
import LivresByUser from '../../components/front/ChefLabo/LivresByUser';
import EquipeByLabo from '../../components/front/ChefLabo/EquipeByLabo';

export default function ChefLaboView({handleLogout}) {
  const { userInfo } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState('profil');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserIdArt, setSelectedUserIdArt] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="row">
            <CardTop />
            <CardProfil handleLogout={handleLogout}/>
            <FormsAjouter />
          </div>
        );
      case 'articles':
        return <Articles />;
      case 'livres':
        return <Livres />;
      case 'users':
        return <Users onUserClick={(userId) => {
          setActiveTab('userLiv');
          setSelectedUserId(userId);
        }}
        onUserArtClick={(userIdArt) => {
          setActiveTab('userArt');
          setSelectedUserIdArt(userIdArt);
        }} />;
      case 'userLiv':
        return <LivresByUser 
        onReturnClick={() => setActiveTab('users')}
                        userId={selectedUserId} />;
      case 'userArt':
        return <ArticlesByUser onReturnClick={() => setActiveTab('users')}
        userId={selectedUserIdArt} />;
        case 'equipes':
        return <EquipeByLabo onReturnClick={() => setActiveTab('equipes')}
        userId={selectedUserIdArt} />;
      case 'notifications':
        return <div>Notifications content goes here</div>;
      default:
        return null;
    }
  };

  return (
    <div className="container-xl px-4 mt-4 home">
      <div className="top-bar">
        <img src={coverHeader} alt="Cover Header" width="100%" />
      </div>

      <div className="title-labo-liv pt-3 pb-3" style={{
        background: '#248ecb24',
        borderRadius: '13px',
        marginTop: '16px'
      }}>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center" style={{
            fontSize: 'larger',
            fontWeight: '300'
          }}>
            <span style={{
              fontWeight: '500',
              color: 'cadetblue',
              fontSize: 'x-large',
              fontFamily: 'system-ui'
            }}>Laboratoire :</span> {userInfo?.laboratoire || 'N/A'}
          </div>
          <div className="col-md-6 text-center" style={{
            fontSize: 'larger',
            fontWeight: '300'
          }}>
            <span style={{
              fontWeight: '500',
              color: 'cadetblue',
              fontSize: 'x-large',
              fontFamily: 'system-ui'
            }}>Equipe :</span> {userInfo?.equipe || 'N/A'}
          </div>
        </div>
      </div>

      <nav className="nav nav-borders mt-3">
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'profil' ? 'active' : ''}`} onClick={() => setActiveTab('profil')}>Profil</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>Articles</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'livres' ? 'active' : ''}`} onClick={() => setActiveTab('livres')}>Livres</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>Membres</a>
        <a style={{ cursor: 'pointer' }} className={`nav-link ${activeTab === 'equipes' ? 'active' : ''}`} onClick={() => setActiveTab('equipes')}>Equipes</a>
      </nav>
      <hr className="mt-0 mb-4" />
      {renderContent()}
    </div>
  );
}
