import React from 'react';
//import coverHeader from '../../assets/cover-header-avec-logo-40ans-05.jpg';

export default function HomeView() {
  return (
    <div className="container-xl px-4 mt-4 home">
      <div className='top-bar'>
        <img /*src={coverHeader}*/ alt="Cover Header" width="100%" />
      </div>
      <hr className="mt-0 mb-4" />
    </div>
  );
}
