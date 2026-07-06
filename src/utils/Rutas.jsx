// src/utils/Rutas.jsx
import React, { Component } from 'react'
import { Routes, Route, useParams, useLocation, useSearchParams } from 'react-router-dom'
import LandingPage from '../components/Landing/LandingPage'
import Login from '../components/auth/Login'
import Register from '../components/auth/Register'
import ShopPage from '../pages/ShopPage'
import Cart from '../components/client/Cart'
import OrdersHistory from '../components/client/OrdersHistory'
import OrderDetail from '../components/client/OrderDetail'
import AdminPage from '../pages/AdminPage'
import AdminGuard from '../components/admin/AdminGuard'
import ClientList from '../components/admin/ClientList'
import OrderList from '../components/admin/OrderList'
import AdminOrderDetail from '../components/admin/AdminOrderDetail'
import DiagnosticoPage from '../pages/DiagnosticoPage'
import NotFoundPage from '../pages/NotFoundPage'
import AuthGuard from '../components/common/AuthGuard'

/**
 * Wrapper para pasar useParams() a componentes de clase (OrderDetail)
 */
function withParams(Component) {
  return function WrappedComponent(props) {
    const params = useParams();
    return <Component {...props} params={params} />;
  };
}

function withLocation(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    return <Component {...props} location={location} searchParams={searchParams} />;
  };
}

const OrderDetailWithParams = withParams(OrderDetail);
const AdminOrderDetailWithParams = withParams(AdminOrderDetail);
const NotFoundPageWithLocation = withLocation(NotFoundPage);

export class Rutas extends Component {
  render() {
    return (
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Registro" element={<Register/>}/>
          <Route path="/Shop" element={<ShopPage/>}/>
          <Route path="/cart" element={<AuthGuard><Cart/></AuthGuard>}/>
          <Route path="/orders" element={<AuthGuard><OrdersHistory/></AuthGuard>}/>
          <Route path="/orders/:id" element={<AuthGuard><OrderDetailWithParams/></AuthGuard>}/>
          <Route path="/admin" element={<AdminGuard><AdminPage/></AdminGuard>}/>
          <Route path="/admin/clientes" element={<AdminGuard><ClientList/></AdminGuard>}/>
          <Route path="/admin/pedidos" element={<AdminGuard><OrderList/></AdminGuard>}/>
          <Route path="/admin/pedidos/:id" element={<AdminGuard><AdminOrderDetailWithParams/></AdminGuard>}/>
          <Route path="/diagnostico" element={<AuthGuard><DiagnosticoPage/></AuthGuard>}/>
          <Route path="/error" element={<NotFoundPageWithLocation/>}/>
          <Route path="*" element={<NotFoundPageWithLocation/>}/>
        </Routes>
    )
  }
}

export default Rutas
