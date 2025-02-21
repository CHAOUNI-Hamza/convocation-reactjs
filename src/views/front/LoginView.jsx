import React, { useState } from 'react';
import '../../css/login.css';
import cover from '../../assets/cover.jpg';
import axios from 'axios';

export default function HomeView() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    let isValid = true;
  
    if (!validateEmail(email)) {
      setEmailError('Adresse email invalide');
      isValid = false;
    } else {
      setEmailError('');
    }
  
    if (!validatePassword(password)) {
      setPasswordError('Le mot de passe doit comporter au moins 6 caractères');
      isValid = false;
    } else {
      setPasswordError('');
    }
  
    if (isValid) {
      try {
        const response = await axios.post(`/auth/login`, {
          email: email,
          password: password,
        });
  
        const { access_token, expires_in  } = response.data;
        const tokenExpiry = new Date(new Date().getTime() + expires_in * 60 * 1000).toISOString();
        
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('tokenExpiry', tokenExpiry);
  
      } catch (error) {
        console.error('Erreur :', error);
        setAuthError('Email ou mot de passe incorrect');
      }
    }
  };
  
  

  return (
    <section className="ftco-section">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mb-5">
            <h2 className="heading-section"></h2>
          </div>
        </div>
        <div className="row justify-content-center">
          
          <div className="col-md-12 col-lg-10">
            <div className="wrap d-md-flex">
              <div className="img img-cover" style={{ backgroundImage: `url(${cover})` }}></div>
              <div className="login-wrap p-4 p-md-5">
                <div className="d-flex">
                  <div className="w-100">
                    <h3 className="mb-4">Se connecter</h3>
                  </div>
                </div>
                <form onSubmit={handleSubmit} className="signin-form">
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="email">Email</label>
                    <input
                    style={{textAlign: 'left'}}
                      type="email" 
                      className="form-control" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <div className="text-danger">{emailError}</div>}
                  </div>
                  <div className="form-group mb-3">
                    <label className="label" htmlFor="password">Mot de passe</label>
                    <input
                    style={{textAlign: 'left'}}
                      type="password" 
                      className="form-control" 
                      placeholder="mot de passe" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <div className="text-danger">{passwordError}</div>}
                  </div>
                  <div className="form-group">
                    <button type="submit" className="form-control btn btn-primary rounded submit px-3 m-0">Se connecter</button>
                  </div>
                  {authError && (
                    <div className="form-group">
                      <div className="text-danger">{authError}</div>
                    </div>
                  )}
                  <div className="form-group d-md-flex">
                    <div className="text-left">
                      <label className="checkbox-primary mb-0 fw-bold">
                        Plateforme MAQALAT - FLSHM Mohammedia
                      </label>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
