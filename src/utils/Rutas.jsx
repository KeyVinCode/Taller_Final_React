// src/utils/Rutas.jsx
import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
// Importamos la LandingPage que ya está estructurada como clase
import LandingPage from '../components/Landing/LandingPage'


export class Rutas extends Component {
  render() {
    return (
        <Routes>
          {/* Configuramos la Landing Page como la ruta raíz inicial */}
          <Route path="/" element={<LandingPage/>} />
          
          
        </Routes>
    )
  }
}

export default Rutas