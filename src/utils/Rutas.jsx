// src/utils/Rutas.jsx
import React, { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import ShopPage from '../pages/ShopPage'
import Cart from '../components/client/Cart'

export class Rutas extends Component {
  render() {
    return (
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Registro" element={<Register/>}/>
          <Route path="/Shop" element={<ShopPage/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
    )
  }
}

export default Rutas
