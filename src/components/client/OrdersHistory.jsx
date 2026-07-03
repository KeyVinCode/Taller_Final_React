// src/components/client/OrdersHistory.jsx
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Home,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { AuthContext } from "../../context/AuthContext";

/**
 * Tasa de cambio: 1 USD → COP (aproximada)
 */
const TASA_CAMBIO_COP = 4200;

/**
 * Convierte un precio en USD a COP y lo formatea
 */
const formatoCOP = (precioUSD) => {
  if (precioUSD === null || precioUSD === undefined) return "$0 COP";
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO") + " COP";
};

/**
 * Devuelve el ícono y color según el estado del pedido
 */
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

export class OrdersHistory extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      pedidos: [],
      cargando: true,
      error: null,
    };
  }

  componentDidMount() {
    this.cargarPedidos();
  }

  cargarPedidos = async () => {
    this.setState({ cargando: true, error: null });

    try {
      const usuario = this.context?.usuario;

      let query = supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      // Si el usuario está logueado, filtramos por su ID
      // Si no, mostramos todos (para pruebas)
      if (usuario?.id) {
        query = query.eq("usuario_id", usuario.id);
      }

      const { data, error } = await query;

      if (error) throw error;

      this.setState({ pedidos: data || [], cargando: false });
    } catch (error) {
      console.error("❌ Error al cargar pedidos:", error.message);
      this.setState({
        pedidos: [],
        cargando: false,
        error: error.message,
      });
    }
  };

  formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Fecha no disponible";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  render() {
    const { pedidos, cargando, error } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">
        {/* Encabezado */}
        <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] p-4 sticky top-0 z-30 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#854d0e]" />
              <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
                Mis Pedidos
              </h1>
            </div>

            <Link
              to="/shop"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la tienda
            </Link>
          </div>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {cargando ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <Package className="w-16 h-16 text-[#854d0e]/40 mx-auto mb-4 animate-pulse" />
              <p className="text-xl font-bold text-[#854d0e] animate-pulse">
                Cargando tus pedidos...
              </p>
            </div>
          ) : error ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#854d0e] mb-2">
                Error al cargar pedidos
              </h2>
              <p className="text-[#5c3a21] mb-6">{error}</p>
              <button
                onClick={this.cargarPedidos}
                className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg cursor-pointer"
              >
                Reintentar
              </button>
            </div>
          ) : pedidos.length === 0 ? (
            /* Estado vacío */
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <ShoppingBag className="w-20 h-20 text-[#854d0e]/40 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#854d0e] mb-2">
                No tienes pedidos aún
              </h2>
              <p className="text-[#5c3a21] mb-6">
                Realiza tu primera compra en la tienda del Valle.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg"
              >
                Ir a la Tienda
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {pedidos.map((pedido) => {
                const estado = obtenerEstadoPedido(pedido.estado);
                const EstadoIcono = estado.icono;
                const productos = pedido.productos || [];
                const totalProductos = productos.reduce(
                  (acc, p) => acc + (p.cantidad || 0),
                  0
                );

                return (
                  <Link
                    key={pedido.id}
                    to={`/orders/${pedido.id}`}
                    className="block bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all overflow-hidden"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs text-gray-500 font-bold">
                            Pedido #{pedido.id?.slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {this.formatearFecha(pedido.created_at)}
                          </p>
                        </div>

                        {/* Estado del pedido */}
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${estado.bg} border-[#854d0e]/30`}
                        >
                          <EstadoIcono
                            className={`w-4 h-4 ${estado.color}`}
                          />
                          <span
                            className={`text-xs font-bold ${estado.color}`}
                          >
                            {estado.texto}
                          </span>
                        </div>
                      </div>

                      {/* Resumen de productos */}
                      <div className="flex items-center gap-2 mb-3">
                        {productos.slice(0, 3).map((prod, idx) => (
                          <div
                            key={idx}
                            className="w-10 h-10 bg-[#15803d] rounded-lg border border-[#854d0e] overflow-hidden flex-shrink-0"
                          >
                            {prod.imagen ? (
                              <img
                                src={prod.imagen}
                                alt={prod.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#fef3c7] text-xs font-bold">
                                {prod.nombre?.[0] || "?"}
                              </div>
                            )}
                          </div>
                        ))}
                        {productos.length > 3 && (
                          <span className="text-xs font-bold text-[#854d0e]">
                            +{productos.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center border-t border-[#854d0e]/20 pt-3">
                        <span className="text-xs text-gray-500 font-bold">
                          {totalProductos} producto(s) ·{" "}
                          {productos.length} tipo(s)
                        </span>
                        <span className="text-sm font-black text-[#15803d]">
                          {formatoCOP(pedido.total_precio)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </main>
      </div>
    );
  }
}

export default OrdersHistory;