import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MemorialSky from './components/MemorialSky';
import UploadDrawing from './components/UploadDrawing';
import DatabaseProvider from './components/DatabaseProvider';

function App() {
  return (
    <DatabaseProvider>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<MemorialSky />} />
          <Route path="/upload" element={<UploadDrawing />} />
        </Routes>
      </div>
    </DatabaseProvider>
  );
}

export default App; 