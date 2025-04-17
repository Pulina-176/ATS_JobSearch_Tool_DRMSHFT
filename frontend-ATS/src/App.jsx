import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { BrowserRouter as Router} from "react-router-dom";

import Login from './pages/Login';
import Home from './pages/Home';
import PdfPreview from './pages/PdfPreview';
import Results from "./pages/Results";
import Display from "./pages/Display";
import ATS from "./pages/ATS";
import ATS_Edit from './pages/ATS-edit';
import ProRoutes from './UI-components/ProRoutes';

import Processing from './UI-components/Processing';


export default function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<ProRoutes />}>
        <Route path="/home" element={<Home />} />
        <Route path="/preview" element={<PdfPreview />} />
        <Route path="/results" element={<Results />} />
        <Route path="/display" element={<Display />} />
        <Route path="/ats-preview" element={<ATS />} />
        <Route path="/ats-edit" element={<ATS_Edit />} />

        <Route path="/test" element={<Processing />} />
      </Route>
    </Routes>
  </Router>
  )
}