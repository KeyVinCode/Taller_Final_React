// src/utils/Rutas.jsx
import React, { Component } from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import ShopPage from '../pages/ShopPage'
import Cart from '../components/client/Cart'
import OrdersHistory from '../components/client/OrdersHistory'
import OrderDetail from '../components/client/OrderDetail'

/**
 * Wrapper para pasar useParams() a componentes de clase (OrderDetail)
 */
function withParams(Component) {
  return function WrappedComponent(props) {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

const OrderDetailWithParams = withParams(OrderDetail);

export class Rutas extends Component {
  render() {
    return (
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Registro" element={<Register/>}/>
          <Route path="/Shop" element={<ShopPage/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/orders" element={<OrdersHistory/>}/>
          <Route path="/orders/:id" element={<OrderDetailWithParams/>}/>
        </Routes>
    )
  }
}

export default Rutas
