import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Form from './Form';
import Map from './Map';

function App() {
  return (
    <div style={{ padding: '10px 20px', textAlign: 'center' }}>
      <h1>AncyMap</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Map />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
