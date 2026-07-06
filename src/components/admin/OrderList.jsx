// src/components/admin/OrderList.jsx — Listado de pedidos para administradores
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Home,
  RefreshCw,
  Edit3,
  X,
  AlertTriangle,
  Eye,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { AuthContext } from "../../context/AuthContext";
import Paginacion from "./Paginacion";

const TASA_CAMBIO_COP = 4200;

const formatoCOP = (precioUSD) => {
  if (precioUSD === null || precioUSD === undefined) return "$0";
  const cop = Math.round(precioUSD * TASA_CAMBIO_COP);
  return "$" + cop.toLocaleString("es-CO");
};

const ESTADOS_DISPONIBLES = [
  { key: "pendiente", icono: Clock, color: "text-[#eab308]", bg: "bg-[#fef3c7]", texto: "Pendiente" },
  { key: "aprobado", icono: CheckCircle, color: "text-[#15803d]", bg: "bg-[#f0fdf4]", texto: "Aprobado" },
  { key: "rechazado", icono: XCircle, color: "text-red-600", bg: "bg-red-50", texto: "Rechazado" },
  { key: "enviado", icono: Truck, color: "text-blue-600", bg: "bg-blue-50", texto: "Enviado" },
  { key: "entregado", icono: Home, color: "text-[#15803d]", bg: "bg-[#f0fdf4]", texto: "Entregado" },
];

const obtenerEstadoPedido = (estado) => {
  return ESTADOS_DISPONIBLES.find((e) => e.key === estado?.toLowerCase()) || ESTADOS_DISPONIBLES[0];
};

export class OrderList extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      pedidos: [],
      perfiles: {},
      cargando: true,
      error: null,
      actualizando: null,
      // Modal de estados
      modalAbierto: false,
      pedidoModal: null,
      // Modal de confirmación personalizado
      confirmacionAbierta: false,
      estadoPendiente: null,
      // Paginación
      paginaActual: 1,
      registrosPorPagina: 10,
    };
  }

  componentDidMount() {
    this.cargarPedidos();
  }

  cargarPedidos = async () => {
    this.setState({ cargando: true, error: null });

    try {
      // Restaurar la sesión de Supabase correctamente
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
      }

      // Obtener todos los pedidos
      const { data: pedidos, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Obtener perfiles de todos los usuarios desde localStorage (stardew_usuario)
      // como fallback principal, ya que RLS puede fallar si la sesión no se restaura bien
      let perfiles = {};

      // 1. Intentar desde Supabase (funciona si la sesión se restauró correctamente)
      try {
        const { data: todosPerfiles } = await supabase
          .from("profiles")
          .select("id, display_name");

        if (todosPerfiles && todosPerfiles.length > 0) {
          todosPerfiles.forEach((p) => {
            perfiles[p.id] = p;
          });
        }
      } catch (e) {}

      // 2. SIEMPRE agregar el usuario actual desde localStorage como respaldo
      try {
        const usuarioStorage = localStorage.getItem("stardew_usuario");
        if (usuarioStorage) {
          const usuario = JSON.parse(usuarioStorage);
          if (usuario?.id && !perfiles[usuario.id]) {
            perfiles[usuario.id] = { display_name: usuario.display_name };
          }
        }
      } catch (e) {}

      this.setState({
        pedidos: pedidos || [],
        perfiles,
        cargando: false,
      });
    } catch (error) {
      console.error("❌ Error al cargar pedidos:", error.message);
      this.setState({ cargando: false, error: error.message });
    }
  };

  abrirModal = (pedido) => {
    document.body.style.overflow = "hidden";
    this.setState({ modalAbierto: true, pedidoModal: pedido });
  };

  cerrarModal = () => {
    document.body.style.overflow = "";
    this.setState({
      modalAbierto: false,
      pedidoModal: null,
      confirmacionAbierta: false,
      estadoPendiente: null,
    });
  };

  /**
   * Abre el modal de confirmación personalizado
   */
  solicitarCambioEstado = (nuevoEstado) => {
    this.setState({
      confirmacionAbierta: true,
      estadoPendiente: nuevoEstado,
    });
  };

  /**
   * Ejecuta el cambio de estado después de la confirmación
   */
  confirmarCambioEstado = async () => {
    const { pedidoModal, estadoPendiente } = this.state;
    if (!pedidoModal || !estadoPendiente) return;

    this.setState({ actualizando: pedidoModal.id, confirmacionAbierta: false });

    try {
      const { error } = await supabase
        .from("orders")
        .update({ estado: estadoPendiente })
        .eq("id", pedidoModal.id);

      if (error) throw error;

      this.setState((prevState) => ({
        pedidos: prevState.pedidos.map((p) =>
          p.id === pedidoModal.id ? { ...p, estado: estadoPendiente } : p
        ),
        actualizando: null,
        modalAbierto: false,
        pedidoModal: null,
        estadoPendiente: null,
      }));

      document.body.style.overflow = "";
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error.message);
      this.setState({ actualizando: null, estadoPendiente: null });
    }
  };

  cancelarCambioEstado = () => {
    this.setState({ confirmacionAbierta: false, estadoPendiente: null });
  };

  formatearFecha = (fechaISO) => {
    if (!fechaISO) return "—";
    return new Date(fechaISO).toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Modal de confirmación personalizado (reemplaza window.confirm)
   */
  renderConfirmacion() {
    const { confirmacionAbierta, pedidoModal, estadoPendiente } = this.state;
    if (!confirmacionAbierta || !pedidoModal || !estadoPendiente) return null;

    const estadoDestino = ESTADOS_DISPONIBLES.find(e => e.key === estadoPendiente);
    const IconoEstado = estadoDestino?.icono || Clock;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={this.cancelarCambioEstado}></div>
        <div className="relative bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] max-w-sm w-full p-6 font-stardewFont text-center">
          <div className="mx-auto w-16 h-16 bg-[#eab308]/20 rounded-full flex items-center justify-center mb-4 border-2 border-[#eab308]/50">
            <AlertTriangle className="w-8 h-8 text-[#eab308]" />
          </div>

          <h3 className="text-lg font-bold text-[#854d0e] mb-2">
            ¿Cambiar estado?
          </h3>

          <p className="text-sm text-[#5c3a21] mb-4">
            Vas a cambiar el pedido <strong>#{pedidoModal.id?.slice(0, 8)}</strong> a:
          </p>

          <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 mb-4 ${estadoDestino?.bg} border-[#854d0e]/40`}>
            <IconoEstado className={`w-5 h-5 ${estadoDestino?.color}`} />
            <span className={`text-base font-black ${estadoDestino?.color}`}>
              {estadoDestino?.texto}
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-6">
            Esta acción actualizará el estado del pedido en la base de datos.
          </p>

          <div className="flex gap-3">
            <button
              onClick={this.cancelarCambioEstado}
              className="flex-1 bg-white hover:bg-gray-100 text-[#854d0e] font-bold py-2.5 rounded-xl border-2 border-[#854d0e] text-sm transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={this.confirmarCambioEstado}
              className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2.5 rounded-xl border-2 border-[#854d0e] text-sm transition-all cursor-pointer"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  renderModal() {
    const { modalAbierto, pedidoModal, actualizando } = this.state;
    if (!modalAbierto || !pedidoModal) return null;

    const estadoActual = obtenerEstadoPedido(pedidoModal.estado);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={this.cerrarModal}
        ></div>

        {/* Modal */}
        <div className="relative bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.25)] max-w-md w-full p-6 font-stardewFont animate-fadeIn">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#854d0e]/20 pb-3">
            <div>
              <h3 className="text-lg font-bold text-[#854d0e]">
                Cambiar Estado
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Pedido #{pedidoModal.id?.slice(0, 8)}
              </p>
            </div>
            <button
              onClick={this.cerrarModal}
              className="text-[#854d0e] hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Estado actual */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-500 mb-2">Estado actual:</p>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${estadoActual.bg} border-[#854d0e]/30`}>
              <estadoActual.icono className={`w-5 h-5 ${estadoActual.color}`} />
              <span className={`text-sm font-bold ${estadoActual.color}`}>
                {estadoActual.texto}
              </span>
            </div>
          </div>

          {/* Todos los estados disponibles */}
          <p className="text-xs font-bold text-gray-500 mb-2">Seleccionar nuevo estado:</p>
          <div className="space-y-2">
              {ESTADOS_DISPONIBLES.map((estado) => {
              const Icono = estado.icono;
              const esActual = estado.key === pedidoModal.estado?.toLowerCase();
              const estadoActualKey = pedidoModal.estado?.toLowerCase();

              // Reglas de validación:
              // - Si es rechazado → no se puede cambiar a nada
              // - Si es aprobado → no se puede volver a pendiente
              // - El estado actual siempre está deshabilitado
              const esRechazado = estadoActualKey === "rechazado";
              const esAprobadoYQuierePendiente = estadoActualKey === "aprobado" && estado.key === "pendiente";
              const estaDeshabilitado = actualizando === pedidoModal.id || esActual || esRechazado || esAprobadoYQuierePendiente;

              // Mensaje de ayuda si está deshabilitado por regla de negocio
              let motivoDeshabilitado = "";
              if (esRechazado) motivoDeshabilitado = "No se puede cambiar un pedido rechazado";
              else if (esAprobadoYQuierePendiente) motivoDeshabilitado = "No se puede volver a Pendiente desde Aprobado";

              return (
                <button
                  key={estado.key}
                  onClick={() => this.solicitarCambioEstado(estado.key)}
                  disabled={estaDeshabilitado}
                  title={motivoDeshabilitado || ""}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all cursor-pointer disabled:cursor-not-allowed ${
                    esActual
                      ? `${estado.bg} border-[#854d0e] opacity-80`
                      : `${estado.bg} border-[#854d0e]/30 hover:border-[#854d0e] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none`
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${estado.bg} border border-[#854d0e]/20`}>
                    <Icono className={`w-5 h-5 ${estado.color}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-bold ${estado.color}`}>
                      {estado.texto}
                      {esActual && " (actual)"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {estado.key === "pendiente" ? "Pedido en espera de revisión" :
                       estado.key === "aprobado" ? "Pedido aprobado para preparación" :
                       estado.key === "rechazado" ? "Pedido rechazado" :
                       estado.key === "enviado" ? "Pedido en camino" :
                       "Pedido entregado al cliente"}
                    </p>
                  </div>
                  {esActual && (
                    <span className="text-xs font-bold text-[#15803d] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#15803d]/30">
                      Actual
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Botón cerrar */}
          <button
            onClick={this.cerrarModal}
            className="w-full mt-4 bg-[#854d0e] hover:bg-[#5c3a21] text-[#fef3c7] font-bold py-2.5 rounded-xl border-2 border-[#5c3a21] text-sm transition-all cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  handleCambiarPagina = (pagina) => {
    this.setState({ paginaActual: pagina });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  render() {
    const { pedidos, perfiles, cargando, error, paginaActual, registrosPorPagina } = this.state;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#60a5fa] via-[#93c5fd] to-[#bfdbfe] flex flex-col font-stardewFont">
        {this.renderModal()}
        {this.renderConfirmacion()}

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
          <div className="bg-[#fef3c7] rounded-2xl border-4 border-[#854d0e] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
            {/* Encabezado */}
            <div className="p-6 border-b-4 border-[#854d0e]/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#eab308]/10 p-2.5 rounded-xl border border-[#eab308]/30">
                    <ShoppingCart className="w-6 h-6 text-[#eab308]" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#854d0e] tracking-wide">
                      Pedidos del Valle
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {pedidos.length} pedido(s) en total
                    </p>
                  </div>
                </div>

                <button
                  onClick={this.cargarPedidos}
                  className="flex items-center gap-1.5 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 px-4 rounded-xl border-2 border-[#854d0e] text-xs transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] active:translate-y-0.5 active:shadow-none cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Actualizar
                </button>
              </div>
            </div>

            {/* Contenido */}
            {cargando ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-[#854d0e]/40 mx-auto mb-3 animate-pulse" />
                <p className="text-lg font-bold text-[#854d0e] animate-pulse">
                  Cargando pedidos...
                </p>
              </div>
            ) : error ? (
              <div className="p-12 text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                  onClick={this.cargarPedidos}
                  className="bg-[#15803d] hover:bg-[#166534] text-white font-bold py-2 px-6 rounded-xl border-2 border-[#854d0e] cursor-pointer"
                >
                  Reintentar
                </button>
              </div>
            ) : pedidos.length === 0 ? (
              <div className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-[#854d0e]/30 mx-auto mb-3" />
                <p className="text-lg font-bold text-[#5c3a21]">
                  No hay pedidos registrados
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {(() => {
                  const inicio = (paginaActual - 1) * registrosPorPagina;
                  const pedidosPaginados = pedidos.slice(inicio, inicio + registrosPorPagina);
                  return null;
                })()}
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#fde68a]/50">
                      <th className="text-left p-3 font-bold text-[#854d0e]">ID</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Fecha</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Cliente</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Productos</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Total</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Estado</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Ver</th>
                      <th className="text-left p-3 font-bold text-[#854d0e]">Editar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#854d0e]/10">
                    {(() => {
                      const inicio = (paginaActual - 1) * registrosPorPagina;
                      return pedidos.slice(inicio, inicio + registrosPorPagina);
                    })().map((pedido) => {
                      const estado = obtenerEstadoPedido(pedido.estado);
                      const EstadoIcono = estado.icono;
                      const perfil = perfiles[pedido.usuario_id];
                      const productos = pedido.productos || [];
                      const totalProductos = productos.reduce(
                        (acc, p) => acc + (p.cantidad || 0),
                        0
                      );

                      return (
                        <tr
                          key={pedido.id}
                          className="hover:bg-[#fef3c7]/70 transition-colors"
                        >
                          <td className="p-3 font-bold text-[#5c3a21] font-mono text-xs">
                            #{pedido.id?.slice(0, 8)}
                          </td>
                          <td className="p-3 text-gray-500 text-xs">
                            {this.formatearFecha(pedido.created_at)}
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-[#5c3a21] text-xs">
                              {perfil?.display_name || "Usuario"}
                            </p>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              {productos.slice(0, 2).map((prod, idx) => (
                                <div
                                  key={idx}
                                  className="w-8 h-8 bg-[#15803d] rounded-lg border border-[#854d0e] overflow-hidden flex-shrink-0"
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
                              {productos.length > 2 && (
                                <span className="text-xs font-bold text-[#854d0e]">
                                  +{productos.length - 2}
                                </span>
                              )}
                              <span className="text-xs text-gray-500 ml-1">
                                ({totalProductos} uds)
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-black text-[#15803d] text-sm">
                            {formatoCOP(pedido.total_precio)}
                          </td>
                          <td className="p-3">
                            <div
                              className={`flex items-center gap-1 px-2 py-1 rounded-full border ${estado.bg} border-[#854d0e]/30`}
                            >
                              <EstadoIcono className={`w-3.5 h-3.5 ${estado.color}`} />
                              <span className={`text-xs font-bold ${estado.color}`}>
                                {estado.texto}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <Link
                              to={`/admin/pedidos/${pedido.id}`}
                              className="flex items-center gap-1 bg-[#15803d] hover:bg-[#166534] text-white font-bold py-1.5 px-2.5 rounded-lg border-2 border-[#5c3a21] text-xs transition-all active:translate-y-0.5 active:shadow-none"
                              title="Ver detalle del pedido"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Ver
                            </Link>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => this.abrirModal(pedido)}
                              className="flex items-center gap-1 bg-[#854d0e] hover:bg-[#5c3a21] text-[#fef3c7] font-bold py-1.5 px-2.5 rounded-lg border-2 border-[#5c3a21] text-xs transition-all active:translate-y-0.5 active:shadow-none cursor-pointer"
                              title="Editar estado del pedido"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              Editar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <Paginacion
                  paginaActual={paginaActual}
                  totalPaginas={Math.ceil(pedidos.length / registrosPorPagina)}
                  onCambiarPagina={this.handleCambiarPagina}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }
}

export default OrderList;