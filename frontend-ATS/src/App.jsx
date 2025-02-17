import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';

import Home from './pages/Home';
import PdfPreview from './pages/PdfPreview';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/preview" element={<PdfPreview/>} />
    </Routes>
  )
}