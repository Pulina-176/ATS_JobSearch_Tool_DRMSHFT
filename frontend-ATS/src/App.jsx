import React from 'react';
import {Routes, Route, Navigate} from 'react-router-dom';
import { BrowserRouter as Router} from "react-router-dom";

import Home from './pages/Home';
import Results from "./pages/Results";
import Display from "./pages/Display";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/results" element={<Results />} />
      <Route path="/display" element={<Display />} />
      
    </Routes>
  )
}