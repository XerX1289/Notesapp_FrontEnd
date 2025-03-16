import React from 'react'
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import { Router, Routes, Route,Navigate} from 'react-router-dom';
import './App.css'
const App = () => {
  
  return (
    <div> 
  
    <Routes>
      <Route path="/" element={<Navigate replace to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Home />} />
    </Routes>


  </div>
  )
}

export default App
