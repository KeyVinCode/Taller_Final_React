// src/utils/Rutas.jsx
import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Importamos la LandingPage que ya está estructurada como clase
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/auth/Login'
import  Register  from '../components/auth/Register'


export class Rutas extends Component {
  render() {
    return (
        <Routes>
            {/* Aquí se añaden las rutas, por ejemplo:
            <Route path="/tienda" element={<Tienda />} /> 
            */}
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Registro" element={<Register/>}/>
          
        </Routes>

    )
  }
}

export default Rutas