import React from 'react'
import Home from "./pages/Home/Home"
import Login from "./pages/Login/Login"
import Register from "./pages/Register/Register"
import {  HashRouter as Router,Routes, Route} from 'react-router-dom'
import './App.css'
const App = () => {
  
  return (
    <div> 
  
    <Routes>
      <Route path="/dashboard" element={<Home/>}/>
      <Route path="/login"   element={<Login/>}/>
      <Route path="/register"  element={<Register/>}/>
    </Routes>  

  </div>
  )
}

export default App
