import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import axios from 'axios';

function Nav() {
    const { userInfo } = useContext(UserContext);
    const [artNum, setArtNum] = useState(null);
    const [livNum, setLivNum] = useState(null);
    const [userNum, setUserNum] = useState(null);
    const [laboNum, setLaboNum] = useState(null);
    const [equipeNum, setEquipeNum] = useState(null);

    useEffect(() => {

        if (userInfo) {
            {/*axios.get('/equipes')
                .then(response => {
                    setEquipeNum(response.data.total);
                })
                .catch(error => {
                    console.error('There was an error fetching art data!', error);
                });*/}
        }
        if (userInfo) {
            axios.get('/articles')
                .then(response => {
                    setArtNum(response.data.total);
                })
                .catch(error => {
                    console.error('There was an error fetching art data!', error);
                });
        }

        if (userInfo) {
            axios.get('/livres')
                .then(response => {
                    setLivNum(response.data.total);
                })
                .catch(error => {
                    console.error('There was an error fetching art data!', error);
                });
        }

        if (userInfo) {
            axios.get('/users')
                .then(response => {
                    setUserNum(response.data.total);
                })
                .catch(error => {
                    console.error('There was an error fetching art data!', error);
                });
        }

        if (userInfo) {
            {/*axios.get('/laboratoires')
                .then(response => {
                    setLaboNum(response.data.total);
                })
                .catch(error => {
                    console.error('There was an error fetching art data!', error);
                });*/}
        }
        
    }, [userInfo]);

  return (
    <div className="content-wrapper" style={{ margin: '0' }}>

<section className="content">
<div className="container-fluid">

<div className="row">
<div className="col-lg-4 col-6">

<div className="small-box bg-info">
<div className="inner">
<h3>{artNum}</h3>
<p>Articles</p>
</div>
<div className="icon">
<i className="ion ion-bag"></i>
</div>
<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
</div>
</div>

<div className="col-lg-4 col-6">

<div className="small-box bg-success">
<div className="inner">
<h3>{livNum}</h3>
<p>Livres</p>
</div>
<div className="icon">
<i className="ion ion-stats-bars"></i>
</div>
<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
</div>
</div>

<div className="col-lg-4 col-6">

<div className="small-box bg-warning">
<div className="inner">
<h3>{userNum}</h3>
<p>Membres</p>
</div>
<div className="icon">
<i className="ion ion-person-add"></i>
</div>
<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
</div>
</div>

<div className="col-lg-6 col-6">

<div className="small-box bg-success-subtle">
<div className="inner">
<h3>{equipeNum}</h3>
<p>Equipes</p>
</div>
<div className="icon">
<i className="ion ion-pie-graph"></i>
</div>
<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
</div>
</div>
<div className="col-lg-6 col-6">

<div className="small-box bg-danger">
<div className="inner">
<h3>{laboNum}</h3>
<p>Laboratoires</p>
</div>
<div className="icon">
<i className="ion ion-pie-graph"></i>
</div>
<a href="#" className="small-box-footer">More info <i className="fas fa-arrow-circle-right"></i></a>
</div>
</div>


</div>


</div>
</section>

</div>
  );
}

export default Nav;
