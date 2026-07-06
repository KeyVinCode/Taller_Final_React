// src/components/admin/AdminOrderDetail.jsx — Detalle de pedido para administradores
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Home,
  ShoppingBag,
  User,
  Mail,
  Calendar,
  ShoppingCart,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";

const TASA_CAMBIO_COP = 4200;

const formatoCOP = (precioUSD) => {
  if (precioUSD === null || precioUSD === undefined) return "$0 COP";
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO") + " COP";
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

export class AdminOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pedido: null,
      perfil: null,
      cargando: true,
      error: null,
    };
  }

  componentDidMount() {
    this.cargarDetalle();
  }

  cargarDetalle = async () => {
    this.setState({ cargando: true, error: null });

    try {
      // Restaurar sesión para RLS
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }

      const orderId = this.props.params?.id;
      if (!orderId) throw new Error("ID de pedido no proporcionado");

      // Obtener el pedido
      const { data: pedido, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (error) throw error;
      if (!pedido) throw new Error("Pedido no encontrado");

      // Obtener el perfil del cliente
      let perfil = null;
      if (pedido.usuario_id) {
        const { data: perfilData } = await supabase
          .from("profiles")
          .select("display_name, email, created_at")
          .eq("id", pedido.usuario_id)
          .single();

        if (perfilData) perfil = perfilData;
      }

      this.setState({ pedido, perfil, cargando: false });
    } catch (error) {
      console.error("❌ Error al cargar detalle:", error.message);
      this.setState({ cargando: false, error: error.message });
    }
  };

  formatearFecha = (fechaISO) => {
    if (!fechaISO) return "Fecha no disponible";
    return new Date(fechaISO).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  render() {
    const { pedido, perfil, cargando, error } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">
        {/* Encabezado */}
        <header className="bg-[#fef3c7] border-b-4 border-[#854d0e] p-4 sticky top-0 z-30 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="w-8 h-8 text-[#854d0e]" />
              <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
                Detalle del Pedido
              </h1>
            </div>

            <Link
              to="/admin/pedidos"
              className="flex items-center gap-2 bg-[#854d0e] hover:bg-[#5c3a21] text-[#fef3c7] font-bold py-2 px-4 rounded-xl border-2 border-[#5c3a21] text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Pedidos
            </Link>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {cargando ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <Package className="w-16 h-16 text-[#854d0e]/40 mx-auto mb-4 animate-pulse" />
              <p className="text-xl font-bold text-[#854d0e] animate-pulse">
                Cargando detalle del pedido...
              </p>
            </div>
          ) : error ? (
            <div className="bg-[#fef3c7] p-12 rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-[#854d0e] mb-2">Error al cargar pedido</h2>
              <p className="text-[#5c3a21] mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={this.cargarDetalle}
                  className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg cursor-pointer"
                >
                  Reintentar
                </button>
                <Link
                  to="/admin/pedidos"
                  className="bg-[#eab308] hover:bg-[#ca8a04] text-[#854d0e] font-bold py-3 px-8 rounded-xl border-2 border-[#854d0e] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)] active:translate-y-0.5 active:shadow-none transition-all text-lg"
                >
                  Volver a pedidos
                </Link>
              </div>
            </div>
          ) : pedido ? (
            <div className="space-y-6">
              {/* Información del cliente */}
              <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="p-5 border-b-4 border-[#854d0e]/20">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#15803d]/10 p-2.5 rounded-xl border border-[#15803d]/30">
                      <User className="w-6 h-6 text-[#15803d]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#854d0e]">
                      Información del Cliente
                    </h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#15803d] rounded-full flex items-center justify-center text-[#fef3c7] font-bold text-lg">
                        {perfil?.display_name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#5c3a21]">
                          {perfil?.display_name || "Usuario"}
                        </p>
                        <p className="text-xs text-gray-500">Nombre</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#854d0e]" />
                      <div>
                        <p className="text-sm font-bold text-[#5c3a21]">
                          {perfil?.email || "—"}
                        </p>
                        <p className="text-xs text-gray-500">Correo electrónico</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#854d0e]" />
                      <div>
                        <p className="text-sm font-bold text-[#5c3a21]">
                          {perfil?.created_at ? this.formatearFecha(perfil.created_at) : "—"}
                        </p>
                        <p className="text-xs text-gray-500">Fecha de registro</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5 text-[#854d0e]" />
                      <div>
                        <p className="text-sm font-bold text-[#5c3a21]">
                          #{pedido.id?.slice(0, 8)}
                        </p>
                        <p className="text-xs text-gray-500">ID del pedido</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información del pedido */}
              <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="p-5 border-b-4 border-[#854d0e]/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold">
                        Pedido #{pedido.id?.slice(0, 8)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {this.formatearFecha(pedido.created_at)}
                      </p>
                    </div>

                    {(() => {
                      const estado = obtenerEstadoPedido(pedido.estado);
                      const EstadoIcono = estado.icono;
                      return (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${estado.bg} border-[#854d0e]/30`}>
                          <EstadoIcono className={`w-5 h-5 ${estado.color}`} />
                          <span className={`font-bold ${estado.color}`}>{estado.texto}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Lista de productos */}
                <div className="divide-y-2 divide-[#854d0e]/20">
                  {(pedido.productos || []).map((producto, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 md:p-6">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-[#15803d] rounded-xl border-2 border-[#854d0e] overflow-hidden flex-shrink-0">
                        {producto.imagen ? (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#fef3c7] text-lg font-bold">
                            {producto.nombre?.[0] || "?"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-[#5c3a21] truncate">
                          {producto.nombre || "Producto"}
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Cantidad: {producto.cantidad || 0} uds.
                        </p>
                        <p className="text-sm font-black text-[#15803d] mt-1">
                          {formatoCOP(producto.precio)} c/u
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-gray-500 font-bold">Subtotal:</p>
                        <p className="font-black text-[#15803d]">
                          {formatoCOP((producto.precio || 0) * (producto.cantidad || 0))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totales */}
                <div className="bg-[#fde68a] p-6 border-t-4 border-[#854d0e]">
                  <div className="max-w-sm ml-auto">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[#854d0e] font-bold">Subtotal:</span>
                      <span className="font-bold text-[#5c3a21]">{formatoCOP(pedido.total_precio)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[#854d0e] font-bold">Envío:</span>
                      <span className="font-bold text-[#15803d]">Gratis 🎉</span>
                    </div>
                    <div className="border-t-2 border-[#854d0e]/40 pt-3 flex justify-between items-center">
                      <span className="text-xl font-bold text-[#854d0e]">Total:</span>
                      <span className="text-2xl font-black text-[#15803d]">{formatoCOP(pedido.total_precio)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    );
  }
}

export default AdminOrderDetail;