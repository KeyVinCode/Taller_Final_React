// src/pages/AdminPage.jsx — Panel de administración (Dashboard)
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Home,
  Store,
} from "lucide-react";
import { supabase } from "../utils/supabaseClient";
import { AuthContext } from "../context/AuthContext";
// AdminNavbar ahora es incluido automáticamente por AdminGuard
import axios from "axios";

const TASA_CAMBIO_COP = 4200;

const formatoCOP = (precioUSD) => {
  if (precioUSD === null || precioUSD === undefined) return "$0";
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO");
};

const obtenerEstadoPedido = (estado) => {
  const estados = {
    pendiente: { icono: Clock, color: "text-[#eab308]", bg: "bg-[#fef3c7]", texto: "Pendiente" },
    aprobado: { icono: CheckCircle, color: "text-[#15803d]", bg: "bg-[#f0fdf4]", texto: "Aprobado" },
    rechazado: { icono: XCircle, color: "text-red-600", bg: "bg-red-50", texto: "Rechazado" },
    enviado: { icono: Truck, color: "text-blue-600", bg: "bg-blue-50", texto: "Enviado" },
    entregado: { icono: Home, color: "text-[#15803d]", bg: "bg-[#f0fdf4]", texto: "Entregado" },
  };
  return estados[estado?.toLowerCase()] || estados.pendiente;
};

export class AdminPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      totalClientes: 0,
      totalPedidos: 0,
      totalProductos: 0,
      pedidosPorEstado: { pendiente: 0, aprobado: 0, rechazado: 0, enviado: 0, entregado: 0 },
      ingresosTotales: 0,
      ultimosPedidos: [],
      perfilesMap: {},
      cargando: true,
      error: null,
    };
  }

  componentDidMount() {
    this.cargarDashboard();
  }

  cargarDashboard = async () => {
    this.setState({ cargando: true, error: null });

    try {
      // Restaurar la sesión de Supabase para que RLS funcione
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }

      // 1. Total de clientes (TODOS, no solo los últimos)
      const { count: totalClientes, error: errClientes } = await supabase
        .from("profiles").select("*", { count: "exact", head: true });
      if (errClientes) throw errClientes;

      // 2. Total REAL de pedidos (contar todos)
      const { count: totalPedidosReal, error: errTotalPedidos } = await supabase
        .from("orders").select("*", { count: "exact", head: true });
      if (errTotalPedidos) throw errTotalPedidos;

      // 3. Contar TODOS los pedidos por estado (sin limit)
      const { data: todosLosPedidos, error: errTodosPedidos } = await supabase
        .from("orders").select("*");
      if (errTodosPedidos) throw errTodosPedidos;

      let totalProductos = 27;
      try {
        const resp = await axios.get("https://dummyjson.com/products/category/groceries?limit=1");
        totalProductos = resp.data.total || 27;
      } catch {}

      const pedidosPorEstado = { pendiente: 0, aprobado: 0, rechazado: 0, enviado: 0, entregado: 0 };
      let ingresosTotales = 0;

      (todosLosPedidos || []).forEach((p) => {
        const estado = (p.estado || "pendiente").toLowerCase();
        if (pedidosPorEstado[estado] !== undefined) pedidosPorEstado[estado]++;
        ingresosTotales += p.total_precio || 0;
      });

      // 4. Últimos 5 pedidos para la tabla resumen
      const { data: pedidos, error: errPedidos } = await supabase
        .from("orders").select("*").order("created_at", { ascending: false }).limit(5);
      if (errPedidos) throw errPedidos;

      // Obtener los nombres de los perfiles de los usuarios (filtrando null/undefined)
      const idsUsuarios = [...new Set((pedidos || []).map((p) => p.usuario_id).filter(Boolean))];
      let perfilesMap = {};
      if (idsUsuarios.length > 0) {
        const { data: perfilesData } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", idsUsuarios);
        if (perfilesData) {
          perfilesData.forEach((p) => {
            perfilesMap[p.id] = p.display_name;
          });
        }
      }

      this.setState({
        totalClientes: totalClientes || 0,
        totalPedidos: totalPedidosReal || 0,
        totalProductos,
        pedidosPorEstado,
        ingresosTotales,
        ultimosPedidos: pedidos || [],
        perfilesMap,
        cargando: false,
      });
    } catch (error) {
      this.setState({ cargando: false, error: error.message });
    }
  };

  formatearFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    return new Date(fechaISO).toLocaleDateString("es-CO", {
      day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  render() {
    const { totalClientes, totalPedidos, totalProductos, pedidosPorEstado, ingresosTotales, ultimosPedidos, perfilesMap, cargando, error } = this.state;
    const usuario = this.context?.usuario;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          {cargando ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <LayoutDashboard className="w-16 h-16 text-[#854d0e]/40 mx-auto mb-4 animate-pulse" />
              <p className="text-xl font-bold text-[#854d0e] animate-pulse">Cargando dashboard...</p>
            </div>
          ) : error ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#854d0e] mb-2">Error al cargar datos</h2>
              <p className="text-[#5c3a21] mb-6">{error}</p>
              <button onClick={this.cargarDashboard} className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg cursor-pointer">Reintentar</button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#15803d]/10 p-2.5 rounded-xl border border-[#15803d]/30"><Users className="w-6 h-6 text-[#15803d]" /></div>
                    <h3 className="text-sm font-bold text-[#854d0e]">Clientes</h3>
                  </div>
                  <p className="text-3xl font-black text-[#5c3a21]">{totalClientes}</p>
                  <p className="text-xs text-gray-500 mt-1">Usuarios registrados</p>
                </div>
                <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#eab308]/10 p-2.5 rounded-xl border border-[#eab308]/30"><ShoppingCart className="w-6 h-6 text-[#eab308]" /></div>
                    <h3 className="text-sm font-bold text-[#854d0e]">Pedidos</h3>
                  </div>
                  <p className="text-3xl font-black text-[#5c3a21]">{totalPedidos}</p>
                  <p className="text-xs text-gray-500 mt-1">Total registrados</p>
                </div>
                <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2.5 rounded-xl border border-blue-300"><Package className="w-6 h-6 text-blue-600" /></div>
                    <h3 className="text-sm font-bold text-[#854d0e]">Productos</h3>
                  </div>
                  <p className="text-3xl font-black text-[#5c3a21]">{totalProductos}</p>
                  <p className="text-xs text-gray-500 mt-1">En el catálogo</p>
                </div>
                <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-[#15803d]/10 p-2.5 rounded-xl border border-[#15803d]/30"><TrendingUp className="w-6 h-6 text-[#15803d]" /></div>
                    <h3 className="text-sm font-bold text-[#854d0e]">Ingresos</h3>
                  </div>
                  <p className="text-3xl font-black text-[#15803d]">{formatoCOP(ingresosTotales)}</p>
                  <p className="text-xs text-gray-500 mt-1">COP totales</p>
                </div>
              </div>

              {/* Estados de pedidos */}
              <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <h2 className="text-lg font-bold text-[#854d0e] mb-4 border-b-2 border-[#854d0e]/20 pb-2">📊 Estados de Pedidos</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { key: "pendiente", label: "Pendientes", icono: Clock, color: "text-[#eab308]", bg: "bg-[#fef3c7]" },
                    { key: "aprobado", label: "Aprobados", icono: CheckCircle, color: "text-[#15803d]", bg: "bg-[#f0fdf4]" },
                    { key: "rechazado", label: "Rechazados", icono: XCircle, color: "text-red-600", bg: "bg-red-50" },
                    { key: "enviado", label: "Enviados", icono: Truck, color: "text-blue-600", bg: "bg-blue-50" },
                    { key: "entregado", label: "Entregados", icono: Home, color: "text-[#15803d]", bg: "bg-[#f0fdf4]" },
                  ].map(({ key, label, icono: Icono, color, bg }) => (
                    <div key={key} className={`${bg} rounded-xl border border-[#854d0e]/20 p-4 text-center`}>
                      <Icono className={`w-6 h-6 ${color} mx-auto mb-1`} />
                      <p className={`text-2xl font-black ${color}`}>{pedidosPorEstado[key] || 0}</p>
                      <p className="text-xs text-gray-500 font-bold mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Últimos pedidos */}
              <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                <div className="p-5 border-b-2 border-[#854d0e]/20">
                  <h2 className="text-lg font-bold text-[#854d0e]">🕐 Últimos Pedidos</h2>
                </div>
                {ultimosPedidos.length === 0 ? (
                  <div className="p-8 text-center">
                    <ShoppingCart className="w-12 h-12 text-[#854d0e]/30 mx-auto mb-2" />
                    <p className="text-sm text-[#5c3a21] font-bold">No hay pedidos registrados aún</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#fde68a]/50">
                          <th className="text-left p-3 font-bold text-[#854d0e]">ID</th>
                          <th className="text-left p-3 font-bold text-[#854d0e]">Fecha</th>
                          <th className="text-left p-3 font-bold text-[#854d0e]">Cliente</th>
                          <th className="text-left p-3 font-bold text-[#854d0e]">Total</th>
                          <th className="text-left p-3 font-bold text-[#854d0e]">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#854d0e]/10">
                        {ultimosPedidos.map((pedido) => {
                          const estado = obtenerEstadoPedido(pedido.estado);
                          const EstadoIcono = estado.icono;
                          return (
                            <tr key={pedido.id} className="hover:bg-[#fef3c7]/50">
                              <td className="p-3 font-bold text-[#5c3a21]">#{pedido.id?.slice(0, 8)}</td>
                              <td className="p-3 text-gray-500">{this.formatearFecha(pedido.created_at)}</td>
                              <td className="p-3 text-gray-500">{perfilesMap[pedido.usuario_id] || pedido.usuario_id?.slice(0, 8) || "Anónimo"}</td>
                              <td className="p-3 font-black text-[#15803d]">{formatoCOP(pedido.total_precio)}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-1.5">
                                  <EstadoIcono className={`w-4 h-4 ${estado.color}`} />
                                  <span className={`text-xs font-bold ${estado.color}`}>{estado.texto}</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default AdminPage;