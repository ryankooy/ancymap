import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import L from 'leaflet';
import './App.css';
import 'leaflet/dist/leaflet.css';
import Form from './Form';
import Map from './Map';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/form" element={<Form />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
