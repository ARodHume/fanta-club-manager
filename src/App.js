
        import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase-config';

// Componenti
import Dashboard from './components/Dashboard';
import TeamDetail from './components/TeamDetail';
import StadiumManagement from './components/StadiumManagement';
import Login from './components/Login';
import Header from './components/Header';

// Inizializza Firebase
const app = initializeApp(firebaseConfig);

function App() {
  return (
    <div className="app">
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team/:id" element={<TeamDetail />} />
          <Route path="/stadium/:id" element={<StadiumManagement />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
